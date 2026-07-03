import { getCurrentUser } from "../get-current-user";
import { prisma } from "../prisma";

export async function getWorkspaceOverviewData(workspaceId: string) {
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
      workspace: {
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              members: true,
              tasks: true,
            },
          },
        },
      },
    },
  });

  if (!membership) {
    return null;
  }

  const [
    pendingTasks,
    inProgressTasks,
    reviewTasks,
    completedTasks,
    overdueTasks,
    pendingInvites,
    recentTasks,
    recentMembers,
  ] = await Promise.all([
    prisma.task.count({
      where: { workspaceId, status: "PENDING" },
    }),
    prisma.task.count({
      where: { workspaceId, status: "IN_PROGRESS" },
    }),
    prisma.task.count({
      where: { workspaceId, status: "REVIEW" },
    }),
    prisma.task.count({
      where: { workspaceId, status: "COMPLETED" },
    }),
    prisma.task.count({
      where: {
        workspaceId,
        dueDate: { lt: new Date() },
        status: { not: "COMPLETED" },
      },
    }),
    prisma.workspaceInvite.count({
      where: { workspaceId, status: "PENDING" },
    }),
    prisma.task.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        priority: true,
        status: true,
        dueDate: true,
        assignee: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    }),
    prisma.workspaceMember.findMany({
      where: { workspaceId },
      orderBy: { joinedAt: "desc" },
      take: 4,
      select: {
        id: true,
        role: true,
        joinedAt: true,
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    }),
  ]);

  return {
    workspace: membership.workspace,
    currentUserRole: membership.role,
    stats: {
      totalTasks: membership.workspace._count.tasks,
      pendingTasks,
      inProgressTasks,
      reviewTasks,
      completedTasks,
      overdueTasks,
      pendingInvites,
      membersCount: membership.workspace._count.members,
    },
    recentTasks,
    recentMembers,
  };
}
