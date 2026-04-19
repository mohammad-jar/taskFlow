import CreateForm from "@/components/workspace/create-form";

const CreateWorkspacePage = () => {
  const formInfo =[
    {label : 'Workspace Name', type: 'input', placeholder: 'Title of workspace', name: 'name'},
    {label : 'Description', type: 'textarea', placeholder: 'Brief description...', name: 'description'},
]
  return (
    <section className="p-5">
      
      <CreateForm title={'Create New Workspace'} formInfo={formInfo} api='workspace' />
    </section>
  );
};

export default CreateWorkspacePage;
