import { BaseRepository } from '../base-repository';

export interface SendNotificationRequest {
    title: string;
    body: string;
    data?: Record<string, string>;
    phoneNumbers?: string[];
}

export interface SendNotificationResponse {
    success: boolean;
    message: string;
}

export class MessagingRepository extends BaseRepository<SendNotificationResponse> {
    constructor() {
        super('api/common/firebase');
    }

    async sendBroadcastNotification(request: SendNotificationRequest): Promise<boolean> {
        return this.post<boolean>('/broadcast', request as unknown as Record<string, unknown>);
    }
}
