import PageHeader from "@/components/page-header";
import ProfileSettingsForm from "@/components/settings/ProfileSettingsForm";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

const SettingsPage = async () => {
  const currentUser = await getCurrentUser();
  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: {
      name: true,
      email: true,
      image: true,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <section className="p-4 sm:p-6">
      <PageHeader
        title1="settings"
        title2="Profile Settings"
        desc="Update how you appear across TaskFlow while keeping account identity secure."
      />

      <ProfileSettingsForm
        initialState={{
          success: false,
          message: "",
          values: {
            name: user.name || "",
            email: user.email || "",
            image: user.image || "",
          },
          errors: {},
        }}
      />
    </section>
  );
};

export default SettingsPage;
