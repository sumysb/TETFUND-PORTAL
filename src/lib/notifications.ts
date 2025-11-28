import { getPgPool } from '@/lib/db';

export async function createNotification(userId: number, type: string, message: string) {
    const pool = getPgPool();
    try {
        await pool.query(
            'INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3)',
            [userId, type, message]
        );
    } catch (error) {
        console.error('Failed to create notification:', error);
    }
}

export async function getNotifications(userId: number) {
    const pool = getPgPool();
    try {
        const result = await pool.query(
            'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
            [userId]
        );
        return result.rows;
    } catch (error) {
        console.error('Failed to get notifications:', error);
        return [];
    }
}

export async function markAsRead(notificationId: number) {
    const pool = getPgPool();
    try {
        await pool.query(
            'UPDATE notifications SET status = \'read\' WHERE notification_id = $1',
            [notificationId]
        );
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
    }
}
