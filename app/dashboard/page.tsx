import DashboardCardsSection from "@/components/cards/DashboardCardsSection";
import TasksStatusChart from "@/components/charts/TasksStatusChart";
import PageHeader from "@/components/page-header";
import getTasksCount from "@/lib/getTasksCount";

const DashboardPage = async() => {
  const tasksCount = await getTasksCount()
  return <div>
    <div className="p-3">
        <PageHeader title1="dashboard overview" title2="Dashboard Overview" desc="Welcome back! Here's whats happening with your tasks."/>
        <DashboardCardsSection tasksCount={tasksCount}/>
        <TasksStatusChart tasksCount={tasksCount}/>
    </div>
  </div>;
};

export default DashboardPage;
