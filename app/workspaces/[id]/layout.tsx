import InviteMemberDialog from "@/components/workspace/invite-dialog";
import WorkspaceToolbar from "@/components/workspace/workspace_toolbar";
import WorkspaceDefine from "@/components/workspace/WorkspaceDefine";
import { getWorkspacePageData } from "@/lib/workspaces/getWorkspacePageData";
import Link from "next/link";

const WorkspaceLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const data = await getWorkspacePageData(id);

  if (!data) return null;

  const { workspace, currentUserRole } = data;

  const canCreateTask =
    currentUserRole === "ADMIN" || currentUserRole === "OWNER";

  return (
    <section className="min-h-full p-4 sm:p-6">
      <div className="rounded-3xl border border-white/80 bg-white/85 p-4 shadow-sm shadow-blue-100/60 backdrop-blur sm:p-5">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <WorkspaceDefine
            workspace_name={workspace.name}
            membersCount={workspace.membersCount}
          />

          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            {currentUserRole !== "MEMBER" && (
              <InviteMemberDialog workspace={workspace} />
            )}

            {canCreateTask && (
              <Link
                href={`/workspaces/${id}/create_task`}
                className="inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-100"
              >
                Create Task
              </Link>
            )}
          </div>
        </div>

        <WorkspaceToolbar workspace_id={id} />

        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
};

export default WorkspaceLayout;
