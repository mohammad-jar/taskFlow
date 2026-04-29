import { prisma } from "../prisma";

export async function getWorkspaceBoardTasks(workspaceId: string) {
  const tasks = await prisma.task.findMany({
    where: {
      workspaceId,
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const groupedTasks = {
    TODO: tasks.filter((task) => task.status === "PENDING"),
    IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS"),
    DONE: tasks.filter((task) => task.status === "COMPLETED"),
  };

  return groupedTasks;
}