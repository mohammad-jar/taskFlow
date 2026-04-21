import { prisma } from "../prisma";

export async function getWorkspaceById(id: string) {
  try {
    const workspace = await prisma.workspace.findFirst({
      where: { id },
      select: {
        name: true,
        _count: {
          select:{
            members: true
          }
        }
      }
    });
    if (!workspace) {
      return {
        success: false,
        message: "can not found this workspace...",
      };
    }
    return {
      workspace: workspace,
    };
  } catch (error) {
    return {
      success: false,
      message: "error while getting workspace by id...",
    };
  }
}
