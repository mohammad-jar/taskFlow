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


type TasksStatsProps = {
  stats: {
    all: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
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
