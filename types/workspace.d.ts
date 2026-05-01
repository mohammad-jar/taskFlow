
type TCreateState = {
  success: boolean;
  message: string;
  errors?: Record<string, string | undefined>;
  workspace_id?: string;
};

type PageProps = {
  params: Promise<{ id: string }>;
};
type TMember = {
  id?: string;
  userId?: string;
  name?: string | null;
  image?: string | null;
  email?: string | null;
  user?: {
    id:string;
    name: string | null;
    email?: string | null;
    image?: string | null;
  };
  role?: "OWNER" | "ADMIN" | "MEMBER";
  joinedAt?: string;
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
