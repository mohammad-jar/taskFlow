import PageHeader from "@/components/page-header";
import CreateTaskForm from "@/components/tasks/create-task/CreateTaskForm";
import { getCurrentUser } from "@/lib/get-current-user";
import { getWorkspaceById } from "@/lib/workspaces/get-workspace-byId";

const CreateWorkspaceTaskPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const user = await getCurrentUser();
  const res = await getWorkspaceById(id);
  const workspace = res.workspace;
  const name = workspace?.name ?? "";
  const members = workspace?.members ?? [];

  return (
    <section >
      <div className="flex items-center justify-between">
        <PageHeader
          title2={`Create Task in ${name}`}
        />
      </div>
      <CreateTaskForm workspaceId={id} members={members ?? []} user_id={user.id} />
    </section>
  );
};

export default CreateWorkspaceTaskPage;
