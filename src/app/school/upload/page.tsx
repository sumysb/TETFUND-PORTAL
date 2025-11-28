import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getSession } from '@/lib/session';
import { getPgPool } from '@/lib/db';
import { redirect } from 'next/navigation';
import UploadForm from '@/components/UploadForm';

export default async function UploadPage() {
    const session = await getSession();
    if (!session || session.role !== 'School') redirect('/');

    const pool = getPgPool();
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [session.userId]);
    const user = userResult.rows[0];

    return (
        <div className="grid-dashboard">
            <Sidebar role="School" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Header user={user} />
                <main className="main-content">
                    <h1 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '24px' }}>Upload Document</h1>
                    <div className="card" style={{ maxWidth: '600px' }}>
                        <UploadForm userId={user.user_id} />
                    </div>
                </main>
            </div>
        </div>
    );
}
