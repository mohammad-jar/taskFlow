import { ClipboardList, CheckCircle2, Clock3, FileText } from "lucide-react";
import DashboardCard from "./DashboardCard";

const cardsConfig: TCardConfig[] = [
  {
    key: "totalTasks",
    title: "Total Tasks",
    icon: <ClipboardList size={22} />,
    cardBgClass: "bg-white border border-slate-200",
    iconColorClass: "text-blue-600",
    iconBgClass: "bg-blue-100",
  },
  {
    key: "completedTasks",
    title: "Completed",
    icon: <CheckCircle2 size={22} />,
    cardBgClass: "bg-white border border-slate-200",
    iconColorClass: "text-emerald-600",
    iconBgClass: "bg-emerald-100",
  },
  {
    key: "inProgressTasks",
    title: "In Progress",
    icon: <Clock3 size={22} />,
    cardBgClass: "bg-white border border-slate-200",
    iconColorClass: "text-amber-600",
    iconBgClass: "bg-amber-100",
  },
  {
    key: "pendingTasks",
    title: "Pending",
    icon: <FileText size={22} />,
    cardBgClass: "bg-white border border-slate-200",
    iconColorClass: "text-rose-600",
    iconBgClass: "bg-rose-100",
  },
];

const DashboardCardsSection = () => {
  // replace it with api endoint values
  const stats: TDashboardStats = {
    totalTasks: 24,
    completedTasks: 8,
    inProgressTasks: 6,
    pendingTasks: 10,
  };
  return (
    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cardsConfig.map((card) => (
        <DashboardCard
          key={card.key}
          title={card.title}
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
