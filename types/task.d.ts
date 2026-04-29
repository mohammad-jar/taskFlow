type CreateTaskValues = {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  assigneeId?: string;
  workspaceId?:string;
};

type CreateTaskState = {
  success: boolean;
  message: string;
  values: CreateTaskValues;
  errors?: {
    title?: string;
    description?: string;
    project?: string;
    priority?: string;
    dueDate?: string;
    assigneeId?: string;
  };
};


type TStatusProps = {
    all?: number;
    pending?: number;
    inProgress?: number;
    completed?: number;
    accepted?: number;
    rejected?: number;
    expired?: number;
};

type TBoardTask = {
  id: string;
  title: string;
  description?: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: Date | string | null;
  assignee?: {
    name?: string | null;
    image?: string | null;
  } | null;
};


type TSearchPageProps = {
  searchParams?: Promise<{
    status?: string;
    search?: string;
    priority?: string;
    sort?: string;
    page: number;
  }>;
};
