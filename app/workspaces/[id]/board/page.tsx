import BoardColumn from "@/components/workspace/board/BoardColumn";
import { getWorkspaceBoardTasks } from "@/lib/workspaces/BoardTasks";

const WorkspaceBoardPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const groupedTasks = await getWorkspaceBoardTasks(id);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-3">
  <BoardColumn title="Todo" tasks={groupedTasks.TODO} />
  <BoardColumn
    title="In Progress"
    tasks={groupedTasks.IN_PROGRESS}
  />
  <BoardColumn title="Done" tasks={groupedTasks.DONE} />
</div>
  );
};
export default WorkspaceBoardPage;