'use server'

import { getPgPool } from '@/lib/db';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { createNotification } from '@/lib/notifications';

export async function uploadFile(prevState: any, formData: FormData) {
    const userId = formData.get('userId');
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
        return { error: 'No file selected' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;

    // Ensure directory exists (optional, but good practice)
    const uploadDir = join(process.cwd(), 'public/uploads');
    const path = join(uploadDir, filename);

    try {
        await writeFile(path, buffer);

        const pool = getPgPool();
        await pool.query(
            'INSERT INTO files (user_id, file_name, file_path, description) VALUES ($1, $2, $3, $4)',
            [userId, title, `/uploads/${filename}`, description]
        );

        // Notify all Department users
        const deptUsers = await pool.query("SELECT user_id FROM users WHERE role = 'Department'");
        for (const dept of deptUsers.rows) {
            await createNotification(dept.user_id, 'New File', `New file uploaded: ${title}`);
        }

        return { message: 'File uploaded successfully!' };
    } catch (error) {
        console.error('Upload error:', error);
        return { error: 'Upload failed' };
    }
}
