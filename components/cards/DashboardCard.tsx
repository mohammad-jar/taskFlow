
const DashboardCard = ({
  title,
  description,
  value,
  icon,
  cardBgClass,
  iconColorClass,
  iconBgClass,
}: TDashboardCardProps) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/70 ${cardBgClass}`}
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/50" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBgClass} ${iconColorClass}`}
        >
          {icon}
        </div>
      </div>

      <p className="relative mt-5 text-sm leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
};

export default DashboardCard;
