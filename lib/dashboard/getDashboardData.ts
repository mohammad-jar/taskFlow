import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";

type DashboardUpdateType = "notification" | "task";

export type DashboardUpdate = {
  id: string;
  type: DashboardUpdateType;
  title: string;
  description: string;
  href: string | null;
  createdAt: Date;
  badge?: string;
};

export async function getDashboardData() {
  const user = await getCurrentUser();

  const memberships = await prisma.workspaceMember.findMany({
    where: { userId: user.id },
    orderBy: { joinedAt: "desc" },
    select: {
      role: true,
      workspace: {
        select: {
          id: true,
          name: true,
          description: true,
          updatedAt: true,
          _count: {
            select: {
              members: true,
            },
          },
        },
      },
    },
  });

  const workspaceIds = memberships.map((membership) => membership.workspace.id);
  const now = new Date();

  const [
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    reviewTasks,
    overdueTasks,
    assignedToMeTasks,
    upcomingTasks,
    recentNotifications,
    recentTasks,
    taskGroups,
    overdueGroups,
  ] =
    workspaceIds.length > 0
      ? await Promise.all([
          prisma.task.count({
            where: { workspaceId: { in: workspaceIds } },
          }),
          prisma.task.count({
            where: { workspaceId: { in: workspaceIds }, status: "COMPLETED" },
          }),
          prisma.task.count({
            where: { workspaceId: { in: workspaceIds }, status: "PENDING" },
          }),
          prisma.task.count({
            where: {
              workspaceId: { in: workspaceIds },
              status: "IN_PROGRESS",
            },
          }),
          prisma.task.count({
            where: { workspaceId: { in: workspaceIds }, status: "REVIEW" },
          }),
          prisma.task.count({
            where: {
              workspaceId: { in: workspaceIds },
              status: { not: "COMPLETED" },
              dueDate: { lt: now },
            },
          }),
          prisma.task.count({
            where: { workspaceId: { in: workspaceIds }, assigneeId: user.id },
          }),
          prisma.task.findMany({
            where: {
              workspaceId: { in: workspaceIds },
              status: { not: "COMPLETED" },
              dueDate: { gte: now },
            },
            orderBy: { dueDate: "asc" },
            take: 5,
            select: {
              id: true,
              title: true,
              status: true,
              priority: true,
              dueDate: true,
              workspace: {
                select: {
                  id: true,
                  name: true,
                },
              },
              assignee: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          }),
          prisma.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
              id: true,
              title: true,
              message: true,
              link: true,
              type: true,
              createdAt: true,
              workspace: {
                select: {
                  name: true,
                },
              },
            },
          }),
          prisma.task.findMany({
            where: { workspaceId: { in: workspaceIds } },
            orderBy: { updatedAt: "desc" },
            take: 5,
            select: {
              id: true,
              title: true,
              status: true,
              updatedAt: true,
              workspace: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          }),
          prisma.task.groupBy({
            by: ["workspaceId", "status"],
            where: { workspaceId: { in: workspaceIds } },
            _count: {
              _all: true,
            },
          }),
          prisma.task.groupBy({
            by: ["workspaceId"],
            where: {
              workspaceId: { in: workspaceIds },
              status: { not: "COMPLETED" },
              dueDate: { lt: now },
            },
            _count: {
              _all: true,
            },
          }),
        ])
      : await Promise.all([
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          [],
          prisma.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
              id: true,
              title: true,
              message: true,
              link: true,
              type: true,
              createdAt: true,
              workspace: {
                select: {
                  name: true,
                },
              },
            },
          }),
          [],
          [],
          [],
        ]);

  const overdueByWorkspace = new Map(
    overdueGroups.map((group) => [group.workspaceId, group._count._all]),
  );

  const taskCountsByWorkspace = taskGroups.reduce(
    (acc, group) => {
      const current = acc.get(group.workspaceId) ?? {
        total: 0,
        pending: 0,
        inProgress: 0,
        review: 0,
        completed: 0,
      };

      current.total += group._count._all;

      if (group.status === "PENDING") current.pending = group._count._all;
      if (group.status === "IN_PROGRESS")
        current.inProgress = group._count._all;
      if (group.status === "REVIEW") current.review = group._count._all;
      if (group.status === "COMPLETED") current.completed = group._count._all;

      acc.set(group.workspaceId, current);
      return acc;
    },
    new Map<
      string,
      {
        total: number;
        pending: number;
        inProgress: number;
        review: number;
        completed: number;
      }
    >(),
  );

  const workspaceSummaries = memberships.slice(0, 4).map((membership) => {
    const workspace = membership.workspace;
    const taskCounts = taskCountsByWorkspace.get(workspace.id) ?? {
      total: 0,
      pending: 0,
      inProgress: 0,
      review: 0,
      completed: 0,
    };

    return {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
      role: membership.role,
      membersCount: workspace._count.members,
      overdueTasks: overdueByWorkspace.get(workspace.id) ?? 0,
      ...taskCounts,
    };
  });

  const updates: DashboardUpdate[] = [
    ...recentNotifications.map((notification) => ({
      id: `notification-${notification.id}`,
      type: "notification" as const,
      title: notification.title,
      description: notification.message,
      href: notification.link,
      createdAt: notification.createdAt,
      badge:
        notification.workspace?.name ||
        notification.type.replaceAll("_", " ").toLowerCase(),
    })),
    ...recentTasks.map((task) => ({
      id: `task-${task.id}`,
      type: "task" as const,
      title: task.title,
      description: `Updated in ${task.workspace.name}`,
      href: `/workspaces/${task.workspace.id}/tasks/${task.id}`,
      createdAt: task.updatedAt,
      badge: task.status.replaceAll("_", " ").toLowerCase(),
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 6);

  return {
    user,
    stats: {
      totalWorkspaces: memberships.length,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      reviewTasks,
      overdueTasks,
      assignedToMeTasks,
    },
    upcomingTasks,
    updates,
    workspaceSummaries,
  };
}
