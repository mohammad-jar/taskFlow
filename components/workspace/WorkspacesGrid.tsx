'use client'
import Link from "next/link";
import { Plus, MoreVertical } from "lucide-react";

type WorkspaceItem = {
  id: string;
  name: string;
  description: string | null;
  membersCount: number;
};

const iconStyles: Record<string, string> = {
  DT: "bg-violet-100 text-violet-700",
  M: "bg-orange-100 text-orange-700",
  P: "bg-green-100 text-green-700",
  S: "bg-amber-100 text-amber-700",
  D: "bg-pink-100 text-pink-700",
};

export default function WorkspacesGrid({
  workspaces,
}: {
  workspaces: WorkspaceItem[];
}) {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            Workspaces
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            My Workspaces
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Organize your teams and collaborate efficiently.
          </p>
        </div>

        <Link
          href="/workspaces/create"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={16} />
          Create Workspace
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/workspaces/create"
          className="flex  min-h-47.5 flex-col items-center justify-center rounded-md border-2 border-dashed border-blue-700 bg-white transition hover:border-blue-500 hover:shadow-sm"
        >
          <div className="mb-4 flex h-12 w-20 px-4 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Plus size={22} />
          </div>
          <p className="text-md font-medium text-blue-600">Create Workspace</p>
        </Link>

        {workspaces.map((workspace) => {
          return (
            <div
              key={workspace.id}
              className="rounded-md border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-2 flex items-center  justify-between">
                <span className='bg-amber-100 text-amber-700 text-center min-h-20 min-w-20 rounded-md text-md font-semibold '>
                  {workspace.name.slice(0, 2).toUpperCase()}
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
    </div>
  );
}
