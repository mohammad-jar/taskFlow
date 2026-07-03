import {
  ClipboardList,
  CheckCircle2,
  Clock3,
  FileSearch,
  FileText,
} from "lucide-react";
import DashboardCard from "./DashboardCard";

const cardsConfig: TCardConfig[] = [
  {
    key: "totalTasks",
    title: "Total Tasks",
    description: "Everything currently tracked across your workspaces.",
    icon: <ClipboardList size={22} />,
    cardBgClass: "border border-white/80 bg-white/90",
    iconColorClass: "text-blue-600",
    iconBgClass: "bg-blue-100",
  },
  {
    key: "completedTasks",
    title: "Completed",
    description: "Finished tasks that have crossed the line.",
    icon: <CheckCircle2 size={22} />,
    cardBgClass: "border border-white/80 bg-white/90",
    iconColorClass: "text-emerald-600",
    iconBgClass: "bg-emerald-100",
  },
  {
    key: "inProgressTasks",
    title: "In Progress",
    description: "Active work that is moving right now.",
    icon: <Clock3 size={22} />,
    cardBgClass: "border border-white/80 bg-white/90",
    iconColorClass: "text-amber-600",
    iconBgClass: "bg-amber-100",
  },
  {
    key: "reviewTasks",
    title: "Review",
    description: "Tasks waiting for a final quality check.",
    icon: <FileSearch size={22} />,
    cardBgClass: "border border-white/80 bg-white/90",
    iconColorClass: "text-blue-600",
    iconBgClass: "bg-blue-100",
  },
  {
    key: "pendingTasks",
    title: "Pending",
    description: "Queued work that has not started yet.",
    icon: <FileText size={22} />,
    cardBgClass: "border border-white/80 bg-white/90",
    iconColorClass: "text-rose-600",
    iconBgClass: "bg-rose-100",
  },
];
interface props {
  tasksCount: {
    totalTasks?: number;
    pendingTasks?: number;
    inProgressTasks?: number;
    reviewTasks?: number;
    completedTasks?: number;
  };
}
const DashboardCardsSection = ({ tasksCount }: props) => {
  const {
    totalTasks,
    pendingTasks,
    inProgressTasks,
    reviewTasks,
    completedTasks,
  } =
    tasksCount;
  const stats: TDashboardStats = {
    totalTasks: totalTasks || 0,
    completedTasks: completedTasks || 0,
    inProgressTasks: inProgressTasks || 0,
    reviewTasks: reviewTasks || 0,
    pendingTasks: pendingTasks || 0,
  };
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cardsConfig.map((card) => (
        <DashboardCard
          key={card.key}
          title={card.title}
          description={card.description}
          value={stats[card.key]}
          icon={card.icon}
          cardBgClass={card.cardBgClass}
          iconColorClass={card.iconColorClass}
          iconBgClass={card.iconBgClass}
        />
      ))}
    </div>
  );
};

export default DashboardCardsSection;
