
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
      className={`interactive-card group relative overflow-hidden rounded-3xl p-5 ${cardBgClass}`}
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-100/50 transition group-hover:scale-125" />
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm transition group-hover:-rotate-3 group-hover:scale-105 ${iconBgClass} ${iconColorClass}`}
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
