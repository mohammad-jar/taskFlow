import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getElementClassName(elementName: string) {
  switch (elementName) {
    case "input":
      return "field-control h-11";
    case "textarea":
      return "field-control min-h-[130px] py-3";

    case "select":
      return "field-control h-11";
    case "error":
      return "mt-2 text-sm text-red-500";
    default:
      return "";
  }
}

export function formatTaskZodErrors(
  fieldErrors: Record<string, string[] | undefined>,
) {
  return {
    title: fieldErrors.title?.[0] || "",
    description: fieldErrors.description?.[0] || "",
    priority: fieldErrors.priority?.[0] || "",
    dueDate: fieldErrors.dueDate?.[0] || "",
  };
}

export function timeAgo(date: string | Date) {
  const now = new Date();
  const past = new Date(date);

  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
}

export function formatName(name: string) {
  return name.slice(0, 2).toUpperCase();
}
export function formatDate(date: string | Date) {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}
