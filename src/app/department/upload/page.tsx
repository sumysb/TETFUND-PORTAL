import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import UploadForm from '@/components/UploadForm';
import { getSession } from '@/lib/session';
import { getPgPool } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function DepartmentUploadPage() {
    const session = await getSession();
    if (!session || session.role !== 'Department') redirect('/');

    const pool = getPgPool();
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [session.userId]);
    const user = userResult.rows[0];

    return (
        <div className="grid-dashboard">
            <Sidebar role="Department" />
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <Header user={user} />
                <main className="main-content">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Upload Response File</h1>
                        <div className="card">
                            <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>File Details</h2>
                            <UploadForm userId={user.user_id} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
