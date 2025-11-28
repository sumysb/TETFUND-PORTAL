'use server'

import { getPgPool } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createNotification } from '@/lib/notifications';

export async function sendMessage(prevState: any, formData: FormData) {
    const senderId = formData.get('senderId');
    const receiverId = formData.get('receiverId');
    const message = formData.get('message') as string;

    if (!message || !receiverId) {
        return { error: 'Message and recipient are required' };
    }

    const pool = getPgPool();
    try {
        await pool.query(
            'INSERT INTO messages (sender_id, receiver_id, message_text) VALUES ($1, $2, $3)',
            [senderId, receiverId, message]
        );

        // Notify Receiver
        await createNotification(Number(receiverId), 'New Message', `You have a new message.`);

        revalidatePath('/school/messages');
        return { message: 'Message sent!' };
    } catch (error) {
        console.error('Send message error:', error);
        return { error: 'Failed to send message' };
    }
}
