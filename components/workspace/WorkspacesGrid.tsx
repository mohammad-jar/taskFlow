"use client";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { formatName } from "@/lib/utils";

type WorkspaceItem = {
  id: string;
  name: string;
  description: string | null;
  membersCount: number;
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
              className="rounded-md border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-2 flex items-center  justify-between">
                <span className="bg-amber-100 text-amber-700 flex items-center justify-center min-h-16 min-w-16 rounded-md text-md font-semibold ">
                  {formatName(workspace.name)}
                </span>

                <button
                  type="button"
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-slate-900">
                  {workspace.name}
                </h2>
                <p className="text-sm text-slate-500">
                  {workspace.membersCount} Members
                </p>
              </div>

              <Link
                href={`/workspaces/${workspace.id}`}
                className="mt-6 flex h-10 items-center justify-center rounded-xl border border-slate-200 text-sm font-medium text-blue-600 transition hover:bg-slate-50"
              >
                View
              </Link>
            </div>
          );
        })}
      </div>

  );
}
