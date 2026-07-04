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
    <section className="page-shell min-h-full">
      <div className="surface-panel p-4 sm:p-5">
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
                className="primary-action h-9 px-4 py-0"
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
