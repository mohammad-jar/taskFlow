import { getWorkspaceDetailsAction } from "@/actions/workspace/workspace-actions";
import { authOptions } from "@/auth";
import InviteMemberDialog from "@/components/workspace/invite-dialog";
import WorkspaceMembersView from "@/components/workspace/workspace-members-view";
import WorkspaceToolbar from "@/components/workspace/workspace_toolbar";
import WorkspaceDefine from "@/components/workspace/WorkspaceDefine";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const WorkspaceDetailsPage = async ({ params }: PageProps) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }
  const { id } = await params;
  const workspace_res = (await getWorkspaceDetailsAction(session.user.id, id))
    .workspace;
  if (!workspace_res || !workspace_res.members) {
    return;
  }
  const workspace = {
    id: workspace_res.id,
    name: workspace_res.name,
    membersCount: workspace_res._count.members,
  };
  const members = workspace_res.members.map((member) => ({
    id: member.id,
    userId: member.userId,
    name: member.user.name,
    email: member.user.email,
    image: member.user.image || null,
    role: member.role,
    joinedAt: member.joinedAt.toISOString(),
  }));
  return (
    <section className="p-5 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-5">
        <WorkspaceDefine workspace_name={workspace.name} membersCount={workspace.membersCount} />
        <div className="flex flex-col space-y-1 items-end">
          <InviteMemberDialog workspace={workspace} />
          <Link
            href={`/tasks/create/${id}`}
            className="inline-flex cursor-pointer h-8 items-center justify-center gap-2 rounded-md border border-blue-500 bg-white px-4 text-md font-medium text-blue-500 transition hover:bg-blue-50 transform duration-200"
          >
            Create Tasks
          </Link>
        </div>
      </div>
      <WorkspaceToolbar workspace_id={id} />

      <WorkspaceMembersView members={members} currentUserId={session.user.id} />
    </section>
  );
};
export default WorkspaceDetailsPage;
