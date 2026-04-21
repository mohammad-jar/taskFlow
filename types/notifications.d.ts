type TCreateNotification = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  senderId?: string | null;
  workspaceId?: string | null;
  inviteId?: string | null;
};

type TNotificationItem = {
    id: string;
    title: string;
    message: string;
    link: string | null;
    isRead: boolean;
    createdAt: Date;
    workspace?: {
      name: string;
    } | null;
    sender?: {
      name: string;
      image?: string;
    }
};