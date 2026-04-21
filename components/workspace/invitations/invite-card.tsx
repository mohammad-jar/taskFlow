"use client";
import { acceptrejectInvitationAction } from "@/actions/workspace/invites/workspace-invite-actions";
import { InviteStatus } from "@/generated/prisma/enums";
import { timeAgo } from "@/lib/utils";
import { Check, X } from "lucide-react";
import Link from "next/link";

type props = {
  invites: TInvite[];
};
const InviteCard = ({ invites }: props) => {
  const handleBtn = async (status: InviteStatus, inviteId: string) => {
    await acceptrejectInvitationAction(inviteId, status);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {invites.map((invite: TInvite) => (
        <div
          key={invite.id}
          className="flex items-center justify-between  rounded-md border border-slate-200 bg-white shadow-sm px-5 py-4 hover:shadow-md transition"
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex items-center justify-center w-12 h-12 rounded-lg  text-yellow-500 font-semibold text-lg">
              DT
            </div>

            {/* Info */}
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-slate-900">
                {invite.workspace.name}
              </h1>

              <p className="text-sm text-slate-500">
                invited you as{" "}
                <span className="ml-1 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
                  {invite.role}
                </span>
              </p>

              <p className="text-xs text-slate-400">
                invited by{" "}
                <span className="font-medium text-slate-600">
                  {invite.invitedBy.name}
                </span>{" "}
                • {timeAgo(invite.createdAt)}
              </p>
            </div>
          </div>

          {invite.status === "PENDING" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBtn("ACCEPTED", invite.id)}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                <Check size={16} />
                Accept
              </button>

              <button
                onClick={() => handleBtn("REJECTED", invite.id)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                <X size={16} />
                Reject
              </button>
            </div>
          )}

          {invite.status === "ACCEPTED" && (
            <div className="flex flex-col items-end">
              <span className="text-green-500 rounded-lg p-2">Accepted</span>
              <Link
                href={`/workspaces/${invite.workspace.id}`}
                className="text-blue-600 border border-blue-300 rounded-md px-4 py-2  hover:bg-blue-300 transform"
              >
                Go to workspace 
              </Link>
            </div>
          )}

          {invite.status === "REJECTED" && (
            <div className="flex flex-col items-end">
              <span className="text-red-500 bg-red-300 rounded-lg p-2">Rejected</span>
              
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InviteCard;
