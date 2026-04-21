import PageHeader from "@/components/page-header";
import CreateTaskForm from "@/components/tasks/create-task/CreateTaskForm";
import WorkspaceDefine from "@/components/workspace/WorkspaceDefine";
import { getWorkspaceById } from "@/lib/workspaces/get-workspace-byId";

const CreateTaskPage = async({params}: PageProps) => {
  const {id} = await params
  const res = await getWorkspaceById(id);
  const name = res.workspace?.name;
const count = Number(res.workspace?._count.members);
  

  
  return (
    <section className="p-5">
      <div className="flex items-center justify-between">
        <PageHeader
        title1={`Workspaces  /  ${name}  /  Create Task`}
        title2={`Create Task in ${name}`}
        desc="Add details to your task and get things done."
      />
      <WorkspaceDefine workspace_name={name || ''} membersCount={count} />
      </div>
      <CreateTaskForm />
    </section>
  );
};

export default CreateTaskPage;
