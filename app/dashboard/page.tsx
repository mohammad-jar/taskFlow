import DashboardCardsSection from "@/components/cards/DashboardCardsSection";
import TasksStatusChart from "@/components/charts/TasksStatusChart";
import PageHeader from "@/components/page-header";
import getTasksCount from "@/lib/getTasksCount";

const DashboardPage = async () => {
  const tasksCount = await getTasksCount();

  return (
    <div className="p-4 sm:p-6">
      <PageHeader
        title1="dashboard overview"
        title2="Dashboard Overview"
        desc="Welcome back. Here is the clearest snapshot of what is moving, waiting, and ready to ship."
      />
      <DashboardCardsSection tasksCount={tasksCount} />
      <TasksStatusChart tasksCount={tasksCount} />
    </div>
  );
};

export default DashboardPage;
