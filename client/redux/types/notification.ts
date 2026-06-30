export type NotificationStatus = "unread" | "read";
export type NotificationAudience = "admin" | "user";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  status: NotificationStatus;
  user?: string;
  audience?: NotificationAudience;
  createdAt: string;
  updatedAt?: string;
}

export interface GetAllNotificationsResponse {
  success: boolean;
  notifications: Notification[];
}

export interface UpdateNotificationsResponse {
  success: boolean;
  notifications: Notification[];
}
