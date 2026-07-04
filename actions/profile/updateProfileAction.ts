"use server";

import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/schema/profileSchema";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const rawName = formData.get("name")?.toString() || "";

  try {
    const currentUser = await getCurrentUser();
    const existingUser = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        email: true,
        image: true,
      },
    });

    if (!existingUser) {
      return {
        success: false,
        message: "Your profile could not be found.",
        resultId: randomUUID(),
        values: {
          name: rawName,
          image: "",
          email: "",
        },
        errors: {},
      };
    }

    const validatedFields = profileSchema.safeParse({ name: rawName });

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Please fix the profile form errors.",
        resultId: randomUUID(),
        values: {
          name: rawName,
          image: existingUser.image || "",
          email: existingUser.email || "",
        },
        errors: {
          name: validatedFields.error.flatten().fieldErrors.name?.[0],
        },
      };
    }

    const avatarFile = formData.get("avatar");
    const hasAvatarUpload = avatarFile instanceof File && avatarFile.size > 0;
    const savedAvatarPath = hasAvatarUpload
      ? await saveAvatarFile(avatarFile)
      : null;

    if (hasAvatarUpload && !savedAvatarPath) {
      return {
        success: false,
        message: "Please upload a valid JPG, PNG, or WebP image under 2MB.",
        resultId: randomUUID(),
        values: {
          name: rawName,
          image: existingUser.image || "",
          email: existingUser.email || "",
        },
        errors: {
          avatar: "Avatar must be JPG, PNG, or WebP and under 2MB.",
        },
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: validatedFields.data.name,
        image: savedAvatarPath || existingUser.image,
      },
      select: {
        name: true,
        email: true,
        image: true,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Profile updated successfully.",
      resultId: randomUUID(),
      values: {
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        image: updatedUser.image || "",
      },
      errors: {},
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Something went wrong while updating your profile.",
      resultId: randomUUID(),
      values: {
        name: rawName,
        image: "",
        email: "",
      },
      errors: {},
    };
  }
}

async function saveAvatarFile(file: File) {
  if (!ALLOWED_AVATAR_TYPES.includes(file.type) || file.size > MAX_AVATAR_SIZE) {
    return null;
  }

  const extension = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const fileName = `${randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
  const uploadPath = path.join(uploadDir, fileName);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(uploadPath, Buffer.from(await file.arrayBuffer()));

  return `/uploads/avatars/${fileName}`;
}
