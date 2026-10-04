"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  Mail,
  MoreHorizontal,
  Search,
  ShieldCheck,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";

type MemberRole = "Owner" | "Admin" | "Member";
type MemberStatus = "Active" | "Pending";

interface Member {
  id: number;
  name: string;
  email: string;
  initials: string;
  role: MemberRole;
  status: MemberStatus;
  joinedAt: string;
  color: string;
}

const initialMembers: Member[] = [
  {
    id: 1,
    name: "Huy Nguyen",
    email: "huy@pulseboard.vn",
    initials: "HN",
    role: "Owner",
    status: "Active",
    joinedAt: "Oct 12, 2025",
    color: "bg-[#e9d5ff] text-[#7e22ce]",
  },
  {
    id: 2,
    name: "Linh Tran",
    email: "linh@pulseboard.vn",
    initials: "LT",
    role: "Admin",
    status: "Active",
    joinedAt: "Nov 03, 2025",
    color: "bg-[#dbeafe] text-[#1d4ed8]",
  },
  {
    id: 3,
    name: "Minh Pham",
    email: "minh@northstar.co",
    initials: "MP",
    role: "Member",
    status: "Active",
    joinedAt: "Jan 18, 2026",
    color: "bg-[#dcfce7] text-[#15803d]",
  },
  {
    id: 4,
    name: "An Le",
    email: "an@bloomstudio.io",
    initials: "AL",
    role: "Member",
    status: "Active",
    joinedAt: "Feb 06, 2026",
    color: "bg-[#ffedd5] text-[#c2410c]",
  },
  {
    id: 5,
    name: "Mai Hoang",
    email: "mai@scaleup.asia",
    initials: "MH",
    role: "Member",
    status: "Active",
    joinedAt: "Mar 21, 2026",
    color: "bg-[#fce7f3] text-[#be185d]",
  },
  {
    id: 6,
    name: "Quang Do",
    email: "quang@seedworks.vn",
    initials: "QD",
    role: "Member",
    status: "Pending",
    joinedAt: "Invited 2 days ago",
    color: "bg-[#f3f4f6] text-[#4b5563]",
  },
];

const roleOptions = ["All roles", "Owner", "Admin", "Member"] as const;

function statusBadge(status: MemberStatus) {
  if (status === "Pending") {
    return (
      <Badge
        variant="outline"
        className="border-[#f2d9a7] bg-[#fff8e8] text-[#96640b]"
      >
        <Mail className="size-3" />
        Pending
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-[#ccebd7] bg-[#effaf3] text-[#267a48]"
    >
      <span className="size-1.5 rounded-full bg-[#36a269]" />
      Active
    </Badge>
  );
}

function MemberIdentity({ member }: { member: Member }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="size-10 border border-white shadow-sm">
        <AvatarFallback className={`text-[12px] font-semibold ${member.color}`}>
          {member.initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[#111827]">
          {member.name}
        </p>
        <p className="truncate text-[13px] text-[#6c737f]">{member.email}</p>
      </div>
    </div>
  );
}

export default function MembersPageClient() {
  const [members, setMembers] = useState(initialMembers);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<(typeof roleOptions)[number]>(
    "All roles",
  );
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<MemberRole>("Member");
  const [inviteNote, setInviteNote] = useState("");
  const [inviteSent, setInviteSent] = useState(false);

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return members.filter((member) => {
      const matchesQuery =
        !normalizedQuery ||
        member.name.toLowerCase().includes(normalizedQuery) ||
        member.email.toLowerCase().includes(normalizedQuery);
      const matchesRole =
        roleFilter === "All roles" || member.role === roleFilter;

      return matchesQuery && matchesRole;
    });
  }, [members, query, roleFilter]);

  const activeCount = members.filter(
    (member) => member.status === "Active",
  ).length;
  const pendingCount = members.length - activeCount;

  const resetInvite = () => {
    setInviteEmail("");
    setInviteRole("Member");
    setInviteNote("");
    setInviteSent(false);
  };

  const handleInvite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = inviteEmail.trim().toLowerCase();

    if (!email) return;

    const localPart = email.split("@")[0] || "New member";
    const name = localPart
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    const initials =
      name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2) || "NM";

    setMembers((current) => [
      ...current,
      {
        id: Date.now(),
        name,
        email,
        initials,
        role: inviteRole,
        status: "Pending",
        joinedAt: "Invited just now",
        color: "bg-[#ede9fe] text-[#6d28d9]",
      },
    ]);
    setInviteSent(true);
  };

  return (
    <div className="flex flex-1 flex-col bg-[#fafbfc]">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[13px] font-medium text-[#6c737f]">
              <span>PulseBoard</span>
              <span className="text-[#d1d5db]">/</span>
              <span className="text-[#111827]">Members</span>
            </div>
            <h1 className="text-[28px] font-bold tracking-[-0.035em] text-[#0d121c]">
              Members
            </h1>
            <p className="mt-1.5 text-sm text-[#6c737f]">
              Manage who can access this workspace and what they can do.
            </p>
          </div>
          <Button
            size="lg"
            className="h-10 rounded-lg bg-[#0d121c] px-4 text-white shadow-sm hover:bg-[#252b35]"
            onClick={() => {
              resetInvite();
              setInviteOpen(true);
            }}
          >
            <UserPlus className="size-4" />
            Invite member
          </Button>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[#e5e7eb] bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-[#6c737f]">
                Total members
              </p>
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#f3f4f6] text-[#4b5563]">
                <UsersRound className="size-4" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-[#111827]">
              {members.length}
            </p>
          </div>
          <div className="rounded-xl border border-[#e5e7eb] bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-[#6c737f]">Active</p>
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#effaf3] text-[#267a48]">
                <Check className="size-4" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-[#111827]">
              {activeCount}
            </p>
          </div>
          <div className="rounded-xl border border-[#e5e7eb] bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-[#6c737f]">
                Pending invites
              </p>
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#fff8e8] text-[#96640b]">
                <Mail className="size-4" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-[#111827]">
              {pendingCount}
            </p>
          </div>
        </div>

        <section className="mt-5 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
          <div className="flex flex-col gap-3 border-b border-[#eef0f2] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="text-[15px] font-semibold text-[#111827]">
                Workspace members
              </h2>
              <p className="mt-0.5 text-[13px] text-[#6c737f]">
                {members.length} people have access to PulseBoard.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9ca3af]" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search members"
                  className="h-9 w-full rounded-lg border-[#e5e7eb] bg-[#f9fafb] pl-9 shadow-none sm:w-[220px]"
                />
              </div>
              <Select
                value={roleFilter}
                onValueChange={(value) =>
                  setRoleFilter(value as (typeof roleOptions)[number])
                }
              >
                <SelectTrigger className="h-9 w-full rounded-lg border-[#e5e7eb] bg-white shadow-none sm:w-[126px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-[#eef0f2] bg-[#fafbfc] hover:bg-[#fafbfc]">
                  <TableHead className="h-11 px-5 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#6c737f]">
                    Member
                  </TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#6c737f]">
                    Role
                  </TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#6c737f]">
                    Status
                  </TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#6c737f]">
                    Joined
                  </TableHead>
                  <TableHead className="w-14" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow
                    key={member.id}
                    className="h-[72px] border-[#eef0f2] hover:bg-[#fafbfc]"
                  >
                    <TableCell className="px-5 py-3">
                      <MemberIdentity member={member} />
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#374151]">
                        {member.role === "Owner" ? (
                          <ShieldCheck className="size-3.5 text-[#6c737f]" />
                        ) : null}
                        {member.role}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      {statusBadge(member.status)}
                    </TableCell>
                    <TableCell className="py-3 text-[13px] text-[#6c737f]">
                      {member.joinedAt}
                    </TableCell>
                    <TableCell className="py-3 pr-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`More actions for ${member.name}`}
                        className="text-[#6c737f] hover:bg-[#f3f4f6]"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="divide-y divide-[#eef0f2] md:hidden">
            {filteredMembers.map((member) => (
              <div key={member.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <MemberIdentity member={member} />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`More actions for ${member.name}`}
                    className="-mr-1 text-[#6c737f]"
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 pl-[52px]">
                  <span className="text-[13px] font-medium text-[#374151]">
                    {member.role}
                  </span>
                  {statusBadge(member.status)}
                </div>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-[#f3f4f6] text-[#6c737f]">
                <Search className="size-5" />
              </span>
              <p className="mt-3 text-sm font-semibold text-[#111827]">
                No members found
              </p>
              <p className="mt-1 text-[13px] text-[#6c737f]">
                Try another name, email, or role.
              </p>
            </div>
          ) : null}
        </section>
      </div>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl ring-1 ring-[#e5e7eb] sm:max-w-[480px]">
          {inviteSent ? (
            <div className="flex flex-col items-center px-8 py-10 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-[#effaf3] text-[#267a48]">
                <Check className="size-6" />
              </span>
              <DialogTitle className="mt-4 text-lg font-semibold text-[#111827]">
                Invitation sent
              </DialogTitle>
              <DialogDescription className="mt-2 max-w-[340px] leading-5">
                We added {inviteEmail} to the member list. Their access will be
                activated after they accept the invitation.
              </DialogDescription>
              <Button
                className="mt-6 h-10 rounded-lg bg-[#0d121c] px-5 text-white hover:bg-[#252b35]"
                onClick={() => setInviteOpen(false)}
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleInvite}>
              <DialogHeader className="border-b border-[#eef0f2] px-6 py-5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#f3f4f6] text-[#111827]">
                  <UserPlus className="size-5" />
                </div>
                <DialogTitle className="mt-1 text-lg font-semibold text-[#111827]">
                  Invite a member
                </DialogTitle>
                <DialogDescription className="leading-5">
                  Invite someone to collaborate in the PulseBoard workspace.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 px-6 py-5">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email address</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    required
                    autoFocus
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    placeholder="name@company.com"
                    className="h-10 rounded-lg border-[#e5e7eb] shadow-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-role">Role</Label>
                  <Select
                    value={inviteRole}
                    onValueChange={(value) =>
                      setInviteRole(value as MemberRole)
                    }
                  >
                    <SelectTrigger
                      id="invite-role"
                      className="h-10 w-full rounded-lg border-[#e5e7eb] shadow-none"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Member">Member</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs leading-5 text-[#6c737f]">
                    Members can post and join discussions. Admins can also
                    manage the workspace.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-note">
                    Personal note
                    <span className="font-normal text-[#9ca3af]">Optional</span>
                  </Label>
                  <Textarea
                    id="invite-note"
                    value={inviteNote}
                    onChange={(event) => setInviteNote(event.target.value)}
                    placeholder="Add a short welcome message..."
                    className="min-h-[82px] resize-none rounded-lg border-[#e5e7eb] shadow-none"
                  />
                </div>
              </div>
              <DialogFooter className="border-t border-[#eef0f2] bg-[#fafbfc] px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-lg border-[#e5e7eb] bg-white px-4 shadow-none"
                  onClick={() => setInviteOpen(false)}
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
    </div>
  );
}
