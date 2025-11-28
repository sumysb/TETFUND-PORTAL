'use server'

import { getPgPool } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addUser(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;

    if (!name || !email || !password || !role) {
        return { error: 'All fields are required' };
    }

    const pool = getPgPool();
    try {
        await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
            [name, email, password, role]
        );

        revalidatePath('/admin/users');
        return { message: 'User added successfully!', success: true };
    } catch (error: any) {
        console.error('Add user error:', error);
        if (error.code === '23505') { // Unique violation
            return { error: 'Email already exists' };
        }
        return { error: 'Failed to add user' };
    }
}
