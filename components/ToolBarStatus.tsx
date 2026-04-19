"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const tasksItems = [
  {
    key: "all",
    label: "All Tasks",
    dotColor: "bg-blue-500",
    ringColor: "ring-blue-500",
    statusValue: null,
  },
  {
    key: "inProgress",
    label: "In Progress",
    dotColor: "bg-yellow-500",
    ringColor: "ring-yellow-500",
    statusValue: "IN_PROGRESS",
  },
  {
    key: "completed",
    label: "Completed",
    dotColor: "bg-green-500",
    ringColor: "ring-green-500",
    statusValue: "COMPLETED",
  },
  {
    key: "pending",
    label: "Pending",
    dotColor: "bg-red-500",
    ringColor: "ring-red-500",
    statusValue: "PENDING",
  },
] as const;

const invitationItems = [
  {
    key: "all",
    label: "All invites",
    dotColor: "bg-blue-500",
    ringColor: "ring-blue-500",
    statusValue: null,
  },
  {
    key: "pending",
    label: "Pending",
    dotColor: "bg-blue-500",
    ringColor: "ring-blue-500",
    statusValue: "pending",
  },
  {
    key: "accepted",
    label: "Accepted",
    dotColor: "bg-green-500",
    ringColor: "ring-green-500",
    statusValue: "accepted",
  },
  {
    key: "rejected",
    label: "Rejected",
    dotColor: "bg-red-500",
    ringColor: "ring-red-500",
    statusValue: "rejected",
  },

  {
    key: "expired",
    label: "Expired",
    dotColor: "bg-yellow-500",
    ringColor: "ring-yellow-500",
    statusValue: "expired",
  },
] as const;

const ToolBarStatus = ({
  status,
  pageName,
}: {
  status: TStatusProps;
  pageName: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status");

  const items = pageName === "tasks" ? tasksItems : invitationItems;

  const handleClick = (statusValue: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!statusValue) {
      params.delete("status");
    } else {
      params.set("status", statusValue);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const isActive =
          item.statusValue === null
            ? !currentStatus
            : currentStatus === item.statusValue;

        return (
          <button
            key={item.key}
            onClick={() => handleClick(item.statusValue)}
            className={`flex cursor-pointer items-center justify-between gap-2 rounded-md bg-white p-2 shadow-sm transition
              ${isActive ? `ring-2 ${item.ringColor}` : "hover:bg-slate-50"}`}
          >
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${item.dotColor}`} />
              <span className="text-sm font-medium text-slate-600">
                {item.label}
              </span>
            </div>

            <span className="text-lg font-bold text-slate-900">
              {status[item.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ToolBarStatus;
