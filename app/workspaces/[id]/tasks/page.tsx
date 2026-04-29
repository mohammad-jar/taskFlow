import {
  getTasksStats,
  getWorkspaceTasks,
} from "@/actions/tasks/tasks_and_stats";
import PageHeader from "@/components/page-header";
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
    <section className="">
      
      <div className="flex justify-between items-center gap-4 mb-4">
        <ToolBarStatus status={stats} pageName="tasks" />

        <SearchToolbar pageName="tasks" />
      </div>
      <TasksTable workspaceId={id} tasks={tasks} totalPages={totalPages} />
    </section>
  );
};

export default WorkspaceTasksPage;
