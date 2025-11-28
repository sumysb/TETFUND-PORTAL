import { getSession } from '@/lib/session';
import { getPgPool } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminUsersClient from './client';

export default async function AdminUsersPage() {
    const session = await getSession();
    if (!session || session.role !== 'Admin') redirect('/');

    const pool = getPgPool();
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [session.userId]);
    const currentUser = userResult.rows[0];

    const allUsers = await pool.query('SELECT * FROM users ORDER BY role, name');

    return <AdminUsersClient user={currentUser} allUsers={allUsers.rows} />;
}
