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

  return (
    <section className="min-h-full bg-white p-5">
      <div className="flex items-center justify-between mb-5">
        <WorkspaceDefine
          workspace_name={workspace.name}
          membersCount={workspace.membersCount}
        />

        <div className="flex flex-col space-y-1 items-end">
          <div className="flex flex-col space-y-1 items-end">
          {currentUserRole !== "MEMBER" && (
            <InviteMemberDialog workspace={workspace} />
          )}

          {currentUserRole === "ADMIN" && (
            <Link
              href={`/workspaces/${id}/create_task`}
              className="inline-flex cursor-pointer h-8 items-center justify-center gap-2 rounded-md border border-blue-500 bg-white px-4 text-md font-medium text-blue-500 transition hover:bg-blue-50"
            >
              Create Task
            </Link>
          )}
        </div>
        </div>
      </div>

      <WorkspaceToolbar workspace_id={id} />

      <div className="mt-5">{children}</div>
    </section>
  );
};

export default WorkspaceLayout;
