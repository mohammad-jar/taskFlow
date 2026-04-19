type CreateTaskValues = {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
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
    assignee?: string;
    tags?: string;
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

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

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
