import { getCurrentUser } from "../get-current-user";
import { prisma } from "../prisma";

type ActivityType = "task" | "invite" | "member" | "notification";

type WorkspaceActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  createdAt: Date;
  href?: string | null;
  actor?: string | null;
  badge?: string;
};

export async function getWorkspaceActivityData(workspaceId: string) {
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
        },
      },
    },
  });

  if (!membership) {
    return null;
  }

  const [tasks, invites, members, notifications] = await Promise.all([
    prisma.task.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        createdAt: true,
        createdBy: {
          select: {
            name: true,
            email: true,
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
    prisma.workspaceInvite.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        invitedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.workspaceMember.findMany({
      where: { workspaceId },
      orderBy: { joinedAt: "desc" },
      take: 12,
      select: {
        id: true,
        role: true,
        joinedAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.notification.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        title: true,
        message: true,
        link: true,
        type: true,
        createdAt: true,
        sender: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  const taskItems: WorkspaceActivityItem[] = tasks.map((task) => ({
    id: `task-${task.id}`,
    type: "task",
    title: `Task created: ${task.title}`,
    description: task.assignee
      ? `Assigned to ${task.assignee.name || task.assignee.email}`
      : "No assignee selected",
    createdAt: task.createdAt,
    href: `/workspaces/${workspaceId}/tasks`,
    actor: task.createdBy.name || task.createdBy.email,
    badge: task.status.replaceAll("_", " ").toLowerCase(),
  }));

  const inviteItems: WorkspaceActivityItem[] = invites.map((invite) => ({
    id: `invite-${invite.id}`,
    type: "invite",
    title: `Invite ${invite.status.toLowerCase()}: ${invite.email}`,
    description: `Invited as ${invite.role.toLowerCase()}`,
    createdAt: invite.createdAt,
    href: `/workspaces/${workspaceId}/members`,
    actor: invite.invitedBy.name || invite.invitedBy.email,
    badge: invite.status.toLowerCase(),
  }));

  const memberItems: WorkspaceActivityItem[] = members.map((member) => ({
    id: `member-${member.id}`,
    type: "member",
    title: `${member.user.name || member.user.email} joined`,
    description: `Joined as ${member.role.toLowerCase()}`,
    createdAt: member.joinedAt,
    href: `/workspaces/${workspaceId}/members`,
    actor: member.user.name || member.user.email,
    badge: member.role.toLowerCase(),
  }));

  const notificationItems: WorkspaceActivityItem[] = notifications.map(
    (notification) => ({
      id: `notification-${notification.id}`,
      type: "notification",
      title: notification.title,
      description: notification.message,
      createdAt: notification.createdAt,
      href: notification.link,
      actor: notification.sender?.name || notification.sender?.email,
      badge: notification.type.replaceAll("_", " ").toLowerCase(),
    }),
  );

  const activity = [
    ...taskItems,
    ...inviteItems,
    ...memberItems,
    ...notificationItems,
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 30);

  return {
    workspace: membership.workspace,
    currentUserRole: membership.role,
    counts: {
      tasks: tasks.length,
      invites: invites.length,
      members: members.length,
      notifications: notifications.length,
    },
    activity,
  };
}
