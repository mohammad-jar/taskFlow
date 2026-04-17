"use server";

import { prisma } from "@/lib/prisma";

export async function getWorkspacesAction(userId: string) {
  try {
    const data = await prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: "desc",
      },
    });

    return { success: true, message: "Got workspaces successfully", data };
  } catch (error) {
    return { success: false, message: "error while getting workspaces" };
  }
}

export async function getWorkspaceDetailsAction(
  userId: string,
  workspaceId: string,
) {
  try {
    const isMember = await prisma.workspaceMember.findFirst({
        where : {userId, workspaceId}
    });
    if(!isMember){
        return {success : false, message: 'you are not member in this workspace'}
    }
    
    const workspace = await prisma.workspace.findFirst({
      where: { id: workspaceId },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
        members: {
          orderBy: {
            joinedAt: "desc",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });
    
    
    return {workspace}
  } catch (error) {
    return {
      success: false,
      message: "error while getting workspace details...",
    };
  }
}
