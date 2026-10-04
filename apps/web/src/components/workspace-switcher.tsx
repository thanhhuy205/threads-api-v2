"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";

export type Workspace = {
  id: string;
  name: string;
  plan: string;
  color: string;
};

type WorkspaceSwitcherProps = {
  workspaces: Workspace[];
  onWorkspaceChange?: (workspace: Workspace) => void;
};

const STORAGE_KEY = "pulseboard.active-workspace";

export function WorkspaceSwitcher({
  workspaces,
  onWorkspaceChange,
}: WorkspaceSwitcherProps) {
  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0]);

  const selectWorkspace = (workspace: Workspace) => {
    setActiveWorkspace(workspace);
    window.localStorage.setItem(STORAGE_KEY, workspace.id);
    window.dispatchEvent(
      new CustomEvent("pulseboard:workspace-change", {
        detail: { workspaceId: workspace.id },
      }),
    );
    onWorkspaceChange?.(workspace);
  };

  if (!activeWorkspace) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-14 rounded-xl border border-sidebar-border bg-white px-2.5 shadow-xs hover:bg-[#f9fafb] data-[state=open]:bg-[#f9fafb]"
            >
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: activeWorkspace.color }}
              >
                <Building2 className="size-4" />
              </span>
              <span className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate text-sm font-semibold text-[#0d121c]">
                  {activeWorkspace.name}
                </span>
                <span className="truncate text-xs text-[#6c737f]">
                  {activeWorkspace.plan}
                </span>
              </span>
              <ChevronsUpDown className="ml-auto size-4 text-[#6c737f]" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="bottom"
            sideOffset={8}
            className="w-[calc(var(--sidebar-width)-2rem)] rounded-xl p-1.5"
          >
            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onSelect={() => selectWorkspace(workspace)}
                className="gap-2.5 rounded-lg p-2"
              >
                <span
                  className="flex size-8 items-center justify-center rounded-md text-white"
                  style={{ backgroundColor: workspace.color }}
                >
                  <Building2 className="size-3.5" />
                </span>
                <span className="grid min-w-0 flex-1">
                  <span className="truncate text-sm font-medium">
                    {workspace.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {workspace.plan}
                  </span>
                </span>
                {workspace.id === activeWorkspace.id ? (
                  <Check className="size-4 text-[#1a84a3]" />
                ) : null}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-lg p-2">
              <span className="flex size-8 items-center justify-center rounded-md border border-dashed border-[#cdd5df]">
                <Plus className="size-4" />
              </span>
              <span className="font-medium">Create workspace</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
