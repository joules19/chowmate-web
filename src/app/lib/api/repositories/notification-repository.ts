import { BaseRepository } from '../base-repository';

export interface BroadcastNotificationRequest {
  title: string;
  body: string;
  expiresAt?: string; // ISO date string
}

export interface SendToUserNotificationRequest {
  userId: string;
  title: string;
  body: string;
  expiresAt?: string;
}

export class NotificationRepository extends BaseRepository<boolean> {
  constructor() {
    super('api/admin/notifications');
  }

  async broadcast(request: BroadcastNotificationRequest): Promise<boolean> {
    return this.post<boolean>('/broadcast', request as unknown as Record<string, unknown>);
  }

  async sendToUser(request: SendToUserNotificationRequest): Promise<boolean> {
    return this.post<boolean>('/send', request as unknown as Record<string, unknown>);
  }
}
