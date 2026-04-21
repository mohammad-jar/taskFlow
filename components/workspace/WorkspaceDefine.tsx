import { formatName } from "@/lib/utils";
import { Users } from "lucide-react";

type pageProps = {
  workspace_name: string;
  membersCount: number;
};

const WorkspaceDefine = ({ workspace_name, membersCount }: pageProps) => {
  return (
    <div>
      <div className="flex items-start justify-center gap-3 mb-2">
        <span className="flex items-center justify-center rounded-md bg-amber-100 px-4 text-3xl h-14 font-medium text-amber-300">
          {formatName(workspace_name)}
        </span>

        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-medium tracking-tight ">
            {workspace_name}
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users size={16} />
            {membersCount} Members
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDefine;
