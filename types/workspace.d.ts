// type TCreateWorkspaceState = {
//     success: boolean;
//   message: string;
//   errors?: {
//     name?: string;
//     description?: string;
//     icon?: string;
//   };
// }

type TCreateState = {
  success: boolean;
  message: string;
  errors?: Record<string, string | undefined>;
};

type PageProps = {
  params: Promise<{ id: string }>;
};
type TMember = {
  id: string;
  userId: string;
  name: string;
  email: string;
  image: string | null;
  role: "OWNER" | "ADMIN" | "MEMBER";
  joinedAt: string;
};

type TWorkspace = {
  id: string;
  name: string;
  membersCount: number;
};

type TInvite = {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  status: string;
  createdAt: Date;
  workspace: {
    name: string;
    id: string;
  };
  invitedBy: {
    name: string | null;
  };
};


type TInviteRole = {
  role: "OWNER" | "ADMIN" | "MEMBER";
};
