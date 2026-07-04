import {
  getTasksStats,
  getWorkspaceTasks,
} from "@/actions/tasks/tasks_and_stats";
import ToolBarStatus from "@/components/ToolBarStatus";
import TasksTable from "@/components/tasks/tasks-table";
import SearchToolbar from "@/components/search-toolbar";

type PageProps = {
  params: { id: string };
  searchParams: {
    page?: number;
    status?: string;
    search?: string;
    priority?: string;
    sort?: string;
  };
};
const WorkspaceTasksPage = async ({ params, searchParams }: PageProps) => {
  const { id } = await params;
  const { page, status, search, priority, sort } = await searchParams;
  const pagee = page ? page : 1;

  const [res, stats] = await Promise.all([
    getWorkspaceTasks(id, pagee, status, search, priority, sort),
    getTasksStats(id),
  ]);

  const { tasks, totalPages } = res;

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
            Task command center
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Plan, filter, and move work forward
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Use status chips for quick triage, search for a specific task, or
            open any task for full details.
          </p>
        </div>

        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-start 2xl:justify-between">
          <ToolBarStatus status={stats} pageName="tasks" />

          <SearchToolbar pageName="tasks" />
        </div>
      </div>
      <TasksTable workspaceId={id} tasks={tasks} totalPages={totalPages} />
    </section>
  );
};

export default WorkspaceTasksPage;
