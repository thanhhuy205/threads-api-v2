"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  Mail,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { type FormEvent, useState } from "react";

interface Team {
  id: string;
  name: string;
  members: number;
  people: Array<{ initials: string; className: string }>;
}

const teams: Team[] = [
  {
    id: "founders",
    name: "Founders Circle",
    members: 12,
    people: [
      { initials: "HN", className: "bg-[#e9d5ff] text-[#7e22ce]" },
      { initials: "LT", className: "bg-[#dbeafe] text-[#1d4ed8]" },
    ],
  },
  {
    id: "product",
    name: "Product Guild",
    members: 8,
    people: [
      { initials: "MP", className: "bg-[#dcfce7] text-[#15803d]" },
      { initials: "AL", className: "bg-[#ffedd5] text-[#c2410c]" },
    ],
  },
  {
    id: "growth",
    name: "Growth Council",
    members: 6,
    people: [
      { initials: "MH", className: "bg-[#fce7f3] text-[#be185d]" },
      { initials: "QD", className: "bg-[#f3f4f6] text-[#4b5563]" },
    ],
  },
];

const STORAGE_KEY = "pulseboard.active-team";

function TeamAvatars({ team }: { team: Team }) {
  return (
    <div className="flex shrink-0 items-center">
      <div className="flex -space-x-1.5">
        {team.people.map((person) => (
          <span
            key={person.initials}
            className={cn(
              "flex size-6 items-center justify-center rounded-full border-2 border-white text-[8px] font-semibold",
              person.className,
            )}
          >
            {person.initials}
          </span>
        ))}
      </div>
      {team.members > team.people.length ? (
        <span className="ml-1 text-[10px] font-medium text-[#6c737f]">
          +{team.members - team.people.length}
        </span>
      ) : null}
    </div>
  );
}

export function TeamSidebarSection() {
  const [expanded, setExpanded] = useState(false);
  const [activeTeamId, setActiveTeamId] = useState(teams[0].id);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);

  const activeTeam =
    teams.find((team) => team.id === activeTeamId) ?? teams[0];

  const selectTeam = (team: Team) => {
    setActiveTeamId(team.id);
    window.localStorage.setItem(STORAGE_KEY, team.id);
    window.dispatchEvent(
      new CustomEvent("pulseboard:team-change", {
        detail: { teamId: team.id },
      }),
    );
  };

  const openInvite = () => {
    setInviteEmail("");
    setInviteSent(false);
    setInviteOpen(true);
  };

  const handleInvite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviteSent(true);
  };

  return (
    <>
      <SidebarGroup className="px-1 py-2">
        <SidebarGroupLabel
          render={
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls="sidebar-team-list"
            />
          }
          onClick={() => setExpanded((current) => !current)}
          className="h-8 w-full justify-between px-2 text-[12px] font-medium text-[#0d121c] hover:bg-[#f9fafb]"
        >
          <span>Teams</span>
          <ChevronDown
            className={cn(
              "size-4 text-[#9da4ae] transition-transform duration-200",
              expanded && "rotate-180",
            )}
          />
        </SidebarGroupLabel>

        {expanded ? (
          <SidebarGroupContent id="sidebar-team-list" className="mt-1">
            <SidebarMenu className="gap-1">
              {teams.map((team) => {
                const selected = team.id === activeTeam.id;

                return (
                  <SidebarMenuItem key={team.id}>
                    <SidebarMenuButton
                      isActive={selected}
                      onClick={() => selectTeam(team)}
                      className="h-11 rounded-lg px-2.5 text-[#4d5761] hover:bg-[#f9fafb] hover:text-[#0d121c] data-active:bg-[#f9fafb] data-active:text-[#0d121c]"
                    >
                      <TeamAvatars team={team} />
                      <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                        {team.name}
                      </span>
                      {selected ? (
                        <Check className="size-3.5 text-[#1a84a3]" />
                      ) : null}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={openInvite}
                  className="h-10 rounded-lg px-3 text-[13px] font-medium text-[#1a84a3] hover:bg-[#eff8fb] hover:text-[#146b84]"
                >
                  <span className="flex size-6 items-center justify-center rounded-full border border-[#b9dfe9] bg-white">
                    <UserPlus className="size-3.5" />
                  </span>
                  <span>Invite to {activeTeam.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="mx-2 mt-1 flex w-[calc(100%-1rem)] items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-[#f9fafb]"
          >
            <UsersRound className="size-4 shrink-0 text-[#6c737f]" />
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[#4d5761]">
              {activeTeam.name}
            </span>
            <span className="text-[10px] text-[#9da4ae]">
              {activeTeam.members}
            </span>
          </button>
        )}
      </SidebarGroup>
      <SidebarSeparator className="mx-2 my-1 bg-[#f3f4f6]" />

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl ring-1 ring-[#e5e7eb] sm:max-w-[440px]">
          {inviteSent ? (
            <div className="flex flex-col items-center px-8 py-10 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-[#effaf3] text-[#267a48]">
                <Check className="size-6" />
              </span>
              <DialogTitle className="mt-4 text-lg font-semibold text-[#0d121c]">
                Invitation sent
              </DialogTitle>
              <DialogDescription className="mt-2 leading-5">
                {inviteEmail} has been invited to join {activeTeam.name}.
              </DialogDescription>
              <Button
                onClick={() => setInviteOpen(false)}
                className="mt-6 h-10 rounded-lg bg-[#0d121c] px-5 text-white hover:bg-[#252b35]"
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleInvite}>
              <DialogHeader className="border-b border-[#f3f4f6] px-6 py-5">
                <span className="mb-1 flex size-10 items-center justify-center rounded-xl bg-[#f3f4f6] text-[#0d121c]">
                  <UserPlus className="size-5" />
                </span>
                <DialogTitle className="text-lg font-semibold text-[#0d121c]">
                  Invite to {activeTeam.name}
                </DialogTitle>
                <DialogDescription className="leading-5">
                  The invitation gives access to this team inside the current
                  workspace.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 px-6 py-5">
                <Label htmlFor="team-invite-email">Email address</Label>
                <Input
                  id="team-invite-email"
                  type="email"
                  required
                  autoFocus
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  placeholder="name@company.com"
                  className="h-10 rounded-lg border-[#e5e7eb] shadow-none"
                />
                <p className="text-xs leading-5 text-[#6c737f]">
                  They will receive an email invitation to join this team.
                </p>
              </div>
              <DialogFooter className="border-t border-[#f3f4f6] bg-[#fafbfc] px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInviteOpen(false)}
                  className="h-10 rounded-lg border-[#e5e7eb] bg-white px-4 shadow-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-10 rounded-lg bg-[#0d121c] px-4 text-white hover:bg-[#252b35]"
                >
                  <Mail className="size-4" />
                  Send invitation
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
