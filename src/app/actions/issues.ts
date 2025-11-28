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

export async function updateIssueStatus(issueId: number, newStatus: string) {
    const pool = getPgPool();
    try {
        await pool.query(
            'UPDATE issues SET status = $1 WHERE issue_id = $2',
            [newStatus, issueId]
        );

        // Fetch issue details to notify reporter
        const issueRes = await pool.query('SELECT school_id, issue_description FROM issues WHERE issue_id = $1', [issueId]);
        const issue = issueRes.rows[0];

        if (issue) {
            await createNotification(issue.school_id, 'Issue Update', `Your issue "${issue.issue_description.substring(0, 20)}..." is now ${newStatus}`);
        }

        revalidatePath('/department/issues');
        revalidatePath('/admin/issues');
        return { success: true };
    } catch (error) {
        console.error('Update issue status error:', error);
        return { error: 'Failed to update status' };
    }
}
