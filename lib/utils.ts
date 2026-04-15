import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getElementClassName(elementName: string) {
  switch (elementName) {
    case "input":
      return "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100";
    case "textarea":
      return "min-h-[130px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

    case "select":
      return "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100";
    case 'error':
      return "mt-2 text-sm text-red-500";
    default:
      return "";
  }
}

export function formatTaskZodErrors  (
  fieldErrors: Record<string, string[] | undefined>,
)  {
  return {
    title: fieldErrors.title?.[0] || "",
    description: fieldErrors.description?.[0] || "",
    priority: fieldErrors.priority?.[0] || "",
    dueDate: fieldErrors.dueDate?.[0] || "",
  };
};


export function formatDate(date: string | Date) {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}
