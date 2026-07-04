import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import type { NextRequest } from "next/server";

const SEARCH_LIMIT = 5;

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return Response.json({ results: [] }, { status: 401 });
  }

  const query = request.nextUrl.searchParams.get("q")?.trim() || "";

  if (query.length < 2) {
    return Response.json({ results: [] });
  }

  const workspaceScope = {
    members: {
      some: {
        userId,
      },
    },
  };

  const [workspaces, tasks, members] = await Promise.all([
    prisma.workspace.findMany({
      where: {
        ...workspaceScope,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: SEARCH_LIMIT,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
      },
    }),
    prisma.task.findMany({
      where: {
        workspace: workspaceScope,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: SEARCH_LIMIT,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        workspaceId: true,
        workspace: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.workspaceMember.findMany({
      where: {
        workspace: workspaceScope,
        user: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        },
      },
      take: SEARCH_LIMIT,
      orderBy: { joinedAt: "desc" },
      select: {
        id: true,
        role: true,
        workspaceId: true,
        workspace: {
          select: {
            name: true,
          },
        },
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

  const results = [
    ...workspaces.map((workspace) => ({
      id: `workspace-${workspace.id}`,
      type: "Workspace",
      title: workspace.name,
      subtitle: workspace.description || "Open workspace overview",
      href: `/workspaces/${workspace.id}`,
    })),
    ...tasks.map((task) => ({
      id: `task-${task.id}`,
      type: "Task",
      title: task.title,
      subtitle: `${task.workspace.name} • ${task.status.replaceAll("_", " ").toLowerCase()}`,
      href: `/workspaces/${task.workspaceId}/tasks/${task.id}`,
    })),
    ...members.map((member) => ({
      id: `member-${member.id}`,
      type: "Member",
      title: member.user.name || member.user.email || "Workspace member",
      subtitle: `${member.workspace.name} • ${member.role.toLowerCase()}`,
      href: `/workspaces/${member.workspaceId}/members`,
      image: member.user.image,
    })),
  ];

  return Response.json({ results });
}
