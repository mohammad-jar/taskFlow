import PageHeader from "@/components/page-header";
import ToolBarStatus from "@/components/ToolBarStatus";
import { redirect } from "next/navigation";
import { getInviteStatus, getUserInvites } from "@/actions/workspace/invites/invite-actions";
import InviteCard from "@/components/workspace/invitations/invite-card";
import { getCurrentUser } from "@/lib/get-current-user";
const InvitationsPage = async ({searchParams}: TSearchPageProps) => {
  const user = await getCurrentUser();
  if (!user || !user.email) {
    redirect("/api/auth/signin");
  }
  const params= await searchParams;
  const page_status = params?.status;
  const email = user.email;
  const [invites, status] = await Promise.all([
    getUserInvites(email, page_status),
    getInviteStatus(email),
  ]);  
  
  return (
    <section className="min-h-full bg-slate-100 p-5">
      <PageHeader
        title1="Invitations"
        title2="Invitations"
        desc="Manage Your Workspace Invitations."
      />

      <div className="flex justify-between items-center gap-4 mb-4">
        <ToolBarStatus status={status} pageName='invites' />

      </div>
      
        <InviteCard invites={invites.invites ?? []} userId={user.id} />
    </section>
  );
};
export default InvitationsPage;
