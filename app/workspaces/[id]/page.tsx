import { getWorkspaceDetailsAction } from "@/actions/workspace/workspace-actions";
import { authOptions } from "@/auth";
import InviteMemberDialog from "@/components/workspace/invite-dialog";
import WorkspaceMembersView from "@/components/workspace/workspace-members-view";
import WorkspaceToolbar from "@/components/workspace/workspace_toolbar";
import { Plus, Users } from "lucide-react";
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
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-2 text-xs   uppercase tracking-wide text-blue-600">
            Workspaces/{workspace.name}
          </p>
          <div className="flex items-start justify-center gap-4 mb-2">
            <span
              
              className="flex items-center justify-center rounded-md bg-amber-100 px-4 text-xl h-14 font-medium text-amber-300"
            >
              DT
            </span>

            <div className="flex flex-col items-start">
              <h1 className="text-3xl font-medium tracking-tight ">
                {workspace.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Users size={16} />
                {workspace.membersCount} Members
              </div>
            </div>
          </div>
        </div>
        <InviteMemberDialog workspace={workspace}/>
      </div>
      <WorkspaceToolbar workspace_id={id} />

      <WorkspaceMembersView  members={members} currentUserId={session.user.id} />
    </section>
  );
};
export default WorkspaceDetailsPage;
