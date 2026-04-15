import { getTasksStats, getUserTasks } from "@/actions/tasks/tasks_and_stats";
import { authOptions } from "@/auth";
import TasksStats from "@/components/tasks/tasks-stats";
import TasksTable from "@/components/tasks/tasks-table";
import TasksToolbar from "@/components/tasks/tasks-toolbar";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

type TasksPageProps = {
  searchParams?: Promise<{
    status?: string;
    search?: string;
    priority?: string;
    sort?: string;
    page: number;
  }>;
};
const TasksPage = async ({ searchParams }: TasksPageProps) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }
  const params = await searchParams;
  const status = params?.status;
  const search = params?.search;
  const priority = params?.priority;
  const sort = params?.sort;
  const page = params ? params.page : 1;

  const userId = session.user.id;
  const [res, stats] = await Promise.all([
    getUserTasks(userId, page, status, search, priority, sort),
    getTasksStats(userId),
  ]);

  const { tasks, totalPages } = res;

  

  return (
    <section className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-2 text-xs   uppercase tracking-wide text-blue-600">
            My Tasks
          </p>
          <h1 className="text-4xl  tracking-tight text-slate-900">Tasks</h1>
          <p className="my-2 text-lg text-slate-500">
            Manage and track all your tasks in one place.
          </p>
        </div>

        <Link
          href="/tasks/create"
          className="inline-flex cursor-pointer h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-md font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={20} />
          Create Task
        </Link>
      </div>
      <div className="flex justify-between items-center gap-4 mb-4">
        <TasksStats stats={stats} />

        <TasksToolbar />
      </div>
      <TasksTable tasks={tasks} totalPages={totalPages} />
    </section>
  );
};

export default TasksPage;
