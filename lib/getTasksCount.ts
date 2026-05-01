import { getCurrentUser } from "./get-current-user";
import { prisma } from "./prisma";

export default async function getTasksCount() {
  try {
    const user = await getCurrentUser();
    const [totalTasks, pendingTasks, inProgressTasks, completedTasks] = await Promise.all([
       prisma.task.count({
        where: { assigneeId: user.id },
      }),
       prisma.task.count({
        where: { assigneeId: user.id, status: 'PENDING'},
      }),
       prisma.task.count({
        where: { assigneeId: user.id, status: 'IN_PROGRESS'},
      }),
       prisma.task.count({
        where: { assigneeId: user.id, status: 'COMPLETED'},
      }),
    ]);

    return {totalTasks, pendingTasks, inProgressTasks, completedTasks}
  } catch {
    return { success: false, message: "error while getting tasks count" };
  }
}
