import React from "react";



const DashboardCard = ({
  title,
  value,
  icon,
  cardBgClass,
  iconColorClass,
  iconBgClass,
}: TDashboardCardProps) => {
  return (
    <div className={`rounded-2xl p-6 ${cardBgClass}`}>
      {/* icon */}
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBgClass} ${iconColorClass}`}
      >
        {icon}
      </div>

      {/* text */}
      <div className="mt-6">
        <p className="text-gray-600 text-sm">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
    </div>
  );
};

export default DashboardCard;