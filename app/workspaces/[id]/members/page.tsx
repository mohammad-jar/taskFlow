import WorkspaceMembersView from "@/components/workspace/workspace-members-view";
import { getWorkspacePageData } from "@/lib/workspaces/getWorkspacePageData";

const WorkspaceMembersPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const data = await getWorkspacePageData(id);

  if (!data) return null;

  return (
    <WorkspaceMembersView
      members={data.members}
      currentUserId={data.user.id}
    />
  );
};

export default WorkspaceMembersPage;
