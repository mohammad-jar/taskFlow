type TDashboardStats = {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
};

type TCardConfig = {
  key: keyof TDashboardStats;
  title: string;
  icon: React.ReactNode;
  cardBgClass: string;
  iconColorClass: string;
  iconBgClass: string;
};

type TDashboardCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  cardBgClass: string;
  iconColorClass: string;
  iconBgClass: string;
};