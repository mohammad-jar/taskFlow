import { getWorkspacesAction } from "@/actions/workspace/workspace-actions";
import { authOptions } from "@/auth";
import WorkspacesGrid from "@/components/workspace/WorkspacesGrid";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const WorkspacesPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }
  const workspaces = await getWorkspacesAction(session.user.id);

  const formattedWorkspaces = workspaces?.data?.map((item) => ({
    id: item.workspace.id,
    name: item.workspace.name,
    description: item.workspace.description,
    icon: item.workspace.icon,
    membersCount: item.workspace._count.members,
  }));
  return (
    <section className="p-5">
      <WorkspacesGrid workspaces={formattedWorkspaces} />
    </section>
  );
};

export default WorkspacesPage;
