import { getWorkspaceDetailsAction } from "@/actions/workspace/workspace-actions";
import { getCurrentUser } from "../get-current-user";

export async function getWorkspacePageData(workspaceId: string) {
  const user = await getCurrentUser();

  const workspace_res = (await getWorkspaceDetailsAction(user.id, workspaceId))
    .workspace;

  if (!workspace_res) return null;

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

  const currentUserRole = members.find(
    (member) => member.userId === user.id
  )?.role;

  return {
    user,
    workspace,
    members,
    currentUserRole,
  };
}