import { prisma } from "@/lib/prisma";

const TASKS_PER_PAGE = 3;

export async function getUserTasks(
  userId: string,
  page: number = 1,
  status?: string,
  search?: string,
  priority?: string,
  sort?: string,
) {
  const safePage = Math.max(1, Number(page) || 1);
  const skip = (safePage - 1) * TASKS_PER_PAGE;

  const whereQuery = {
    userId,
    ...(status ? { status: status as any } : {}),
    ...(priority ? { priority: priority as any } : {}),
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

export async function getTasksStats(userId: string) {
  const [all, pending, inProgress, completed] = await Promise.all([
    prisma.task.count({
      where: { userId },
    }),
    prisma.task.count({
      where: { userId, status: "PENDING" },
    }),
    prisma.task.count({
      where: { userId, status: "IN_PROGRESS" },
    }),
    prisma.task.count({
      where: { userId, status: "COMPLETED" },
    }),
  ]);

  return {
    all,
    pending,
    inProgress,
    completed,
  };
}

const getSortOption = (sort?: string) => {
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
