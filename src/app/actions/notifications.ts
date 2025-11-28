'use server'

import { getNotifications, markAsRead } from '@/lib/notifications';

export async function getUserNotifications(userId: number) {
    return await getNotifications(userId);
}

export async function markNotificationAsRead(notificationId: number) {
    await markAsRead(notificationId);
}
