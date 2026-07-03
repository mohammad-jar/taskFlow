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
    <section className="space-y-4">
      <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
          Workflow board
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          Move work from idea to done
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          Start pending tasks, send active work to review, and complete tasks
          once they are ready.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <BoardColumn
          title="Todo"
          tasks={groupedTasks.TODO}
          workspaceId={id}
          actionLabel="Start"
          nextStatus="IN_PROGRESS"
          actionClassName="bg-blue-50 text-blue-500 hover:bg-blue-100"
        />
        <BoardColumn
          title="In Progress"
          tasks={groupedTasks.IN_PROGRESS}
          workspaceId={id}
          actionLabel="Send to review"
          nextStatus="REVIEW"
          actionClassName="bg-amber-50 text-amber-600 hover:bg-amber-100"
        />
        <BoardColumn
          title="Review"
          tasks={groupedTasks.REVIEW}
          workspaceId={id}
          actionLabel="Complete"
          nextStatus="COMPLETED"
          actionClassName="bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
        />
        <BoardColumn title="Done" tasks={groupedTasks.DONE} workspaceId={id} />
      </div>
    </section>
  );
};
export default WorkspaceBoardPage;
