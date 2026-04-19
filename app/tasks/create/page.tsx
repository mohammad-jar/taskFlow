import PageHeader from "@/components/page-header";
import CreateTaskForm from "@/components/tasks/create-task/CreateTaskForm";

const CreateTaskPage = () => {
  return (
    <section className="p-5">
      <PageHeader
        title="Create New Task"
        desc="Add details to your task and get things done."
      />
      <CreateTaskForm />
    </section>
  );
};

export default CreateTaskPage;
