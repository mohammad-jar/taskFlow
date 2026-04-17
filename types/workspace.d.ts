type TCreateWorkspaceState = {
    success: boolean;
  message: string;
  errors?: {
    name?: string;
    description?: string;
    icon?: string;
  };
}

type TMember = {
    id: string;
    userId: string;
    name: string;
    email: string;
    image: string | null;
    role: "OWNER" | "ADMIN" | "MEMBER";
    joinedAt: string;
};