import { getCurrentUser } from "../get-current-user";
import { prisma } from "../prisma";

export async function getWorkspaceTaskDetailsData(
  workspaceId: string,
  taskId: string,
) {
  const user = await getCurrentUser();

  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: user.id,
      },
    },
    select: {
      role: true,
    },
  });

  if (!membership) {
    return null;
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      workspaceId,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      workspace: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!task) {
    return null;
  }

  const canManageTask =
    task.createdById === user.id ||
    task.assigneeId === user.id ||
    membership.role === "OWNER" ||
    membership.role === "ADMIN";

  return {
    task,
    currentUserRole: membership.role,
    canManageTask,
  };
}
