'use server'

import { getPgPool } from '@/lib/db';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;

    if (!email || !password || !role) {
        return { error: 'All fields are required' };
    }

    const pool = getPgPool();
    let user;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND role = $2',
            [email, role]
        );

        user = result.rows[0];

        if (!user) {
            return { error: 'Invalid credentials or role' };
        }

        if (user.password !== password) {
            return { error: 'Invalid credentials' };
        }

        await createSession(user.user_id.toString(), user.role);
    } catch (error) {
        console.error('Login error:', error);
        return { error: 'Something went wrong' };
    }

    if (user) {
        redirect(`/${role.toLowerCase()}`);
    }
}

export async function logout() {
    await deleteSession();
    redirect('/');
}
