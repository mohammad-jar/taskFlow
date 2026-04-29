import { getWorkspacesAction } from "@/actions/workspace/workspace-actions";
import ItemsNotFound from "@/components/ItemsNotFound";
import PageHeader from "@/components/page-header";
import WorkspacesGrid from "@/components/workspace/WorkspacesGrid";
import { getCurrentUser } from "@/lib/get-current-user";

const WorkspacesPage = async () => {
  const user = await getCurrentUser();
  const workspaces = await getWorkspacesAction(user.id);
  const formattedWorkspaces = workspaces?.data?.map((item) => ({
    id: item.workspace.id,
    name: item.workspace.name,
    description: item.workspace.description,
    icon: item.workspace.icon,
    membersCount: item.workspace._count.members,
  }));
  return (
    <section className="p-5">
      <PageHeader
        title1="Workspaces"
        title2="Workspaces"
        desc="Organize your teams and collaborate efficiently."
        right_link="Create Workspace"
        href="/workspaces/create"
      />
      {formattedWorkspaces?.length != 0 ? (
        <WorkspacesGrid workspaces={formattedWorkspaces ?? []} />
      ) : (
        <ItemsNotFound
          title="No Workspaces"
          link_name="Create Workspace"
          next_page="/workspaces/create"
          desc="ipsum dolor sielit. vitae iusto minus dolo"
        />
      )}
    </section>
  );
};

export default WorkspacesPage;
