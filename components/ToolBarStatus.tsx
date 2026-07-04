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
    key: "review",
    label: "Review",
    dotColor: "bg-blue-500",
    ringColor: "ring-blue-500",
    statusValue: "REVIEW",
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
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(8.75rem,1fr))] gap-2">
      {items.map((item) => {
        const isActive =
          item.statusValue === null
            ? !currentStatus
            : currentStatus === item.statusValue;
        const count = status[item.key] ?? 0;

        return (
          <button
            key={item.key}
            onClick={() => handleClick(item.statusValue)}
            className={`grid min-w-0 cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-2xl border border-white bg-white/90 px-3 py-2.5 text-left shadow-sm transition-all duration-200
              ${
                isActive
                  ? `bg-white ring-2 ${item.ringColor} shadow-blue-100`
                  : "hover:-translate-y-0.5 hover:bg-blue-50/50 hover:shadow-md hover:shadow-blue-100/60"
              }`}
          >
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.dotColor}`}
            />
            <span className="min-w-0 text-sm font-medium leading-tight text-slate-600">
              {item.label}
            </span>

            <span className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 px-2 text-base font-semibold tabular-nums text-slate-950 shadow-inner">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ToolBarStatus;
