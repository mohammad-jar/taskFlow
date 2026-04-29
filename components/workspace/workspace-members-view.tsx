"use client";

import { MoreVertical } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

type WorkspaceProps = {
  currentUserId: string;
  members: TMember[];
};

const roleStyles = {
  OWNER: "bg-blue-50 text-blue-600 border border-blue-200",
  ADMIN: "bg-violet-50 text-violet-700",
  MEMBER: "bg-emerald-50 text-emerald-700",
};

export default function WorkspaceMembersView({
  currentUserId,
  members,
}: WorkspaceProps) {
  const formatName = (name: string) => {
    const parts = name?.split(" ") || [];
    return parts.length > 1 ? `${parts[0]} ${parts[1][0]}` : name;
  };

  return (
    <div className="mt-2 rounded-2xl bg-white shadow-lg">

      {/* 🟢 Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
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
              members.map((member) => {
                const role = member.role ?? "MEMBER";

                return (
                <tr
                  key={member.id}
                  className="border-b border-gray-100 hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={member.image || "/profile.png"}
                        alt="user"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />

                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">
                          {formatName(member.name || "")}
                        </p>

                        {currentUserId === member.userId && (
                          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                            you
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {member.email}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${
                        roleStyles[role]
                      }`}
                    >
                      {role.toLowerCase()}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatDate(member.joinedAt || "")}
                  </td>

                  <td className="px-6 py-4">
                    <button className="rounded-lg p-2 hover:bg-slate-100">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              )})
            )}
          </tbody>
        </table>
      </div>

      {/* 🔵 Mobile Cards */}
      <div className="md:hidden flex flex-col gap-3 p-3">
        {members.length === 0 ? (
          <div className="text-center text-sm text-slate-500 py-6">
            No members found.
          </div>
        ) : (
          members.map((member) => {
            const role = member.role ?? "MEMBER";

            return (
            <div
              key={member.id}
              className="rounded-xl border border-slate-200 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={member.image || "/profile.png"}
                    alt="user"
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />

                  <div>
                    <p className="font-semibold text-slate-900">
                      {formatName(member.name || "")}
                    </p>

                    <p className="text-xs text-slate-500">
                      {member.email}
                    </p>
                  </div>
                </div>

                <button className="p-2 rounded-lg hover:bg-slate-100">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                    roleStyles[role]
                  }`}
                >
                  {role.toLowerCase()}
                </span>

                <span className="text-xs text-slate-500">
                  {formatDate(member.joinedAt || "")}
                </span>
              </div>

              {currentUserId === member.userId && (
                <div className="mt-2">
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                    you
                  </span>
                </div>
              )}
            </div>
          )})
        )}
      </div>
    </div>
  );
}
