"use cliet";
import Link from "next/link";
import {
  Search,
  MoreVertical,
  Settings,
  FolderKanban,
  Users,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

type WorkspaceProps = {
  workspace: {
    id: string;
    name: string;
    membersCount: number;
  };
  currentUserId: string;
  members: TMember[];
};
const roleStyles = {
  OWNER: "bg-blue-50 text-blue-600 px-2 border border-blue-200 py-1",
  ADMIN: "bg-violet-50 text-violet-700",
  MEMBER: "bg-emerald-50 text-emerald-700",
};
export default function WorkspaceMembersView({
  workspace,
  currentUserId,
  members,
}: WorkspaceProps) {
  const formatName = (name: string) => {
    const nameArray = name.split(" ");
    return `${nameArray[0]} ${nameArray[1][0]}`;
  };

  return (
    <div className="mt-2 overflow-hidden rounded-2xl bg-white px-4 py-2 shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr className="text-left text-sm text-slate-500">
              <th className="px-6 py-4 font-medium">Member</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm text-slate-500"
                >
                  No members found.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-gray-100 hover:bg-slate-50 last:border-b-0"
                >
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={member.image || "/profile.png"}
                        alt={member.name}
                        width={30}
                        height={30}
                        className="rounded-full object-cover"
                      />

                      <p className="font-semibold text-slate-900">
                        {formatName(member.name)}{" "}
                        <span
                          className={` rounded-md   text-sm ml-1 ${roleStyles[member.role]}`}
                        >
                          {currentUserId === member.userId && "you"}
                        </span>
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {member.email}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-md  py-1 text-sm font-medium ${roleStyles[member.role]}`}
                    >
                      {member.role.toLowerCase()}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatDate(member.joinedAt)}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      type="button"
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
