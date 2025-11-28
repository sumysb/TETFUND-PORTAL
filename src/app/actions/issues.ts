'use server'

import { getPgPool } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createNotification } from '@/lib/notifications';

export async function reportIssue(prevState: any, formData: FormData) {
    const schoolId = formData.get('schoolId');
    const description = formData.get('description') as string;
    const departmentId = formData.get('departmentId'); // Optional, if targeting a specific dept

    if (!description) {
        return { error: 'Description is required' };
    }

    const pool = getPgPool();
    try {
        // For now, assign to a default department or make it general (null)
        // Assuming we want to assign to ICT (id 2) for now or let admin triage
        await pool.query(
            'INSERT INTO issues (school_id, issue_description, status) VALUES ($1, $2, $3)',
            [schoolId, description, 'Pending']
        );

        // Notify Admin
        const adminUsers = await pool.query("SELECT user_id FROM users WHERE role = 'Admin'");
        for (const admin of adminUsers.rows) {
            await createNotification(admin.user_id, 'New Issue', `New issue reported: ${description.substring(0, 50)}...`);
        }

        revalidatePath('/school/issues');
        return { message: 'Issue reported successfully!' };
    } catch (error) {
        console.error('Report issue error:', error);
        return { error: 'Failed to report issue' };
    }
}
