import { useMutation } from '@tanstack/react-query';
import { MessagingRepository, SendNotificationRequest } from '../../api/repositories/messaging-repository';

const messagingRepo = new MessagingRepository();

export function useSendPushNotification() {
    return useMutation({
        mutationFn: (request: SendNotificationRequest) =>
            messagingRepo.sendBroadcastNotification(request),
    });
}
