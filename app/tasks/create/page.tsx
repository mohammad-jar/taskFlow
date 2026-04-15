import CreateTaskForm from "@/components/tasks/create-task/CreateTaskForm";

const CreateTaskPage = () => {
  return (
    <section className="p-5">
      <p className="mb-2 text-xs   uppercase tracking-wide text-blue-600">
        Create New Task
      </p>
      <h1 className="text-4xl  tracking-tight text-slate-900">
        Create a New Task
      </h1>
      <p className="my-2 text-lg text-slate-500">
        Add details to your task and get things done.
      </p>
      <CreateTaskForm />
    </section>
  );
};

export default CreateTaskPage;
