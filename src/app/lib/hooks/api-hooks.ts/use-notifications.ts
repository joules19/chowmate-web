import { useMutation } from '@tanstack/react-query';
import {
  NotificationRepository,
  BroadcastNotificationRequest,
  SendToUserNotificationRequest,
} from '../../api/repositories/notification-repository';

const notificationRepo = new NotificationRepository();

export function useBroadcastNotification() {
  return useMutation({
    mutationFn: (request: BroadcastNotificationRequest) =>
      notificationRepo.broadcast(request),
  });
}

export function useSendToUserNotification() {
  return useMutation({
    mutationFn: (request: SendToUserNotificationRequest) =>
      notificationRepo.sendToUser(request),
  });
}
