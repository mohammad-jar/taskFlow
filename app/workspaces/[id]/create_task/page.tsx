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
    <section className="space-y-4">
      <PageHeader
        title1="new task"
        title2={`Create Task in ${name}`}
        desc="Add a clear title, owner, priority, and due date so the task can move through the board."
      />
      <CreateTaskForm
        workspaceId={id}
        members={members ?? []}
        user_id={user.id}
      />
    </section>
  );
};

export default CreateWorkspaceTaskPage;
