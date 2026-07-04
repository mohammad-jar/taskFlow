"use client";
import Link from "next/link";
import { ArrowRight, UsersRound } from "lucide-react";
import { formatName } from "@/lib/utils";
import WorkspaceCardActions from "./WorkspaceCardActions";

type WorkspaceItem = {
  id: string;
  name: string;
  description: string | null;
  membersCount: number;
  role: "OWNER" | "ADMIN" | "MEMBER";
};

export default function WorkspacesGrid({
  workspaces,
}: {
  workspaces: WorkspaceItem[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {workspaces.map((workspace) => {
        return (
          <div
            key={workspace.id}
            className="interactive-card surface-panel group relative overflow-hidden p-5"
          >
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-100/70 transition group-hover:scale-125" />
            <div className="relative mb-5 flex items-start justify-between gap-3">
              <span className="flex min-h-16 min-w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-base font-semibold text-white shadow-sm shadow-blue-200">
                {formatName(workspace.name)}
              </span>

              <WorkspaceCardActions workspace={workspace} />
            </div>

            <div className="relative space-y-2">
              <h2 className="line-clamp-1 text-lg font-semibold text-slate-950">
                {workspace.name}
              </h2>
              <p className="line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                {workspace.description ||
                  "A focused space for tasks, members, and progress."}
              </p>
              <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                <UsersRound size={14} />
                {workspace.membersCount} member
                {workspace.membersCount === 1 ? "" : "s"}
              </p>
            </div>

            <Link
              href={`/workspaces/${workspace.id}`}
              className="secondary-action mt-6 h-10 w-full"
            >
              Open workspace
              <ArrowRight size={16} />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
