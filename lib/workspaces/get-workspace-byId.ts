import { prisma } from "../prisma";

export async function getWorkspaceById(id: string) {
  try {
   const workspace = await prisma.workspace.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    _count: {
      select: {
        members: true,
      },
    },
    members: {
      select: {
        id: true,
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        joinedAt: "desc",
      },
    },
  },
});
    if (!workspace) {
      return {
        success: false,
        message: "can not found this workspace...",
      };
    }
    return {
      success: true,
      message: "Workspace fetched successfully",
      workspace,
    };
  } catch (error) {
    return {
      success: false,
      message: "error while getting workspace by id...",
    };
  }
}
