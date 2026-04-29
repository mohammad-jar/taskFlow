import PageHeader from "@/components/page-header";
import TasksToolbar from "@/components/search-toolbar";
import ToolBarStatus from "@/components/ToolBarStatus";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { getInviteStatus, getUserInvites } from "@/actions/workspace/invites/invite-actions";
import InviteCard from "@/components/workspace/invitations/invite-card";
const InvitationsPage = async ({searchParams}: TSearchPageProps) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.email) {
    redirect("/login");
  }
  const params= await searchParams;
  const page_status = params?.status;
  const email = session.user.email;
  const [invites, status] = await Promise.all([
    getUserInvites(email, page_status),
    getInviteStatus(email),
  ]);  
  
  return (
    <section className="p-5 bg-slate-100 min-h-screen ">
      <PageHeader
        title1="Invitations"
        title2="Invitations"
        desc="Manage Your Workspace Invitations."
      />

      <div className="flex justify-between items-center gap-4 mb-4">
        <ToolBarStatus status={status} pageName='invites' />

      </div>
      
        <InviteCard invites={invites.invites ?? []} />
    </section>
  );
};

export default InvitationsPage;
