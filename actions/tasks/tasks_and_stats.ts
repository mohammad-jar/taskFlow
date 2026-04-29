import { prisma } from "@/lib/prisma";
import {
  Prisma,
  TaskPriority,
  TaskStatus,
} from "@/generated/prisma/client";

const TASKS_PER_PAGE = 3;
const TASK_STATUSES = Object.values(TaskStatus);
const TASK_PRIORITIES = Object.values(TaskPriority);

export async function getWorkspaceTasks(
  workspaceId: string,
  page: number = 1,
  status?: string,
  search?: string,
  priority?: string,
  sort?: string,
) {
  const safePage = Math.max(1, Number(page) || 1);
  const skip = (safePage - 1) * TASKS_PER_PAGE;

  const whereQuery: Prisma.TaskWhereInput = {
    workspaceId,
    ...(isTaskStatus(status) ? { status } : {}),
    ...(isTaskPriority(priority) ? { priority } : {}),
    ...(search?.trim()
      ? {
          OR: [
            {
              title: {
                contains: search.trim(),
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search.trim(),
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  };

  const [tasks, totalTasks] = await Promise.all([
    prisma.task.findMany({
      where: whereQuery,
      orderBy: getSortOption(sort),
      skip,
      take: TASKS_PER_PAGE,
    }),

    prisma.task.count({
      where: whereQuery,
    }),
  ]);

  const totalPages = Math.ceil(totalTasks / TASKS_PER_PAGE);

  return {
    tasks,
    totalPages,
  };
}

export async function getTasksStats(workspaceId: string) {
  const [all, pending, inProgress, completed] = await Promise.all([
    prisma.task.count({
      where: { workspaceId },
    }),
    prisma.task.count({
      where: { workspaceId, status: "PENDING" },
    }),
    prisma.task.count({
      where: { workspaceId, status: "IN_PROGRESS" },
    }),
    prisma.task.count({
      where: { workspaceId, status: "COMPLETED" },
    }),
  ]);

  return {
    all,
    pending,
    inProgress,
    completed,
  };
}

const getSortOption = (sort?: string): Prisma.TaskOrderByWithRelationInput => {
  switch (sort) {
    case "oldest":
      return { createdAt: "asc" };

    case "due_asc":
      return { dueDate: "asc" };

    case "due_desc":
      return { dueDate: "desc" };

    case "priority_desc":
      return { priority: "desc" };

    default:
      return { createdAt: "desc" }; // newest
  }
};

function isTaskStatus(status?: string): status is TaskStatus {
  return TASK_STATUSES.includes(status as TaskStatus);
}

function isTaskPriority(priority?: string): priority is TaskPriority {
  return TASK_PRIORITIES.includes(priority as TaskPriority);
}
