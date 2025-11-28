import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getSession } from '@/lib/session';
import { getPgPool } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DepartmentDashboard() {
    const session = await getSession();
    if (!session) redirect('/');

    const pool = getPgPool();
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [session.userId]);
    const user = userResult.rows[0];

    if (!user) redirect('/');

    // Fetch stats
    const pendingRequests = await pool.query(`
    SELECT COUNT(*) FROM files f 
    JOIN users u ON f.user_id = u.user_id 
    WHERE u.role = 'School'
  `);

    return (
        <div className="grid-dashboard">
            <Sidebar role="Department" />
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <Header user={user} />
                <main className="main-content">
                    <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '32px' }}>Department Dashboard</h1>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                        <div className="card">
                            <h3 style={{ fontSize: '16px', color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '8px' }}>Pending Requests</h3>
                            <div style={{ fontSize: '48px', fontWeight: '500', color: 'var(--md-sys-color-primary)' }}>
                                {pendingRequests.rows[0].count}
                            </div>
                            <div style={{ marginTop: '16px' }}>
                                <Link href="/department/requests" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                    Review Requests
                                </Link>
                            </div>
                        </div>

                        <div className="card">
                            <h3 style={{ fontSize: '16px', color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '8px' }}>Quick Actions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Link href="/department/upload" className="btn btn-secondary" style={{ justifyContent: 'flex-start', width: '100%' }}>
                                    📤 Upload Response File
                                </Link>
                                <Link href="/department/issues" className="btn btn-secondary" style={{ justifyContent: 'flex-start', width: '100%' }}>
                                    📝 Update Issue Status
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '16px' }}>Recent Activity</h2>
                        <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '14px' }}>
                            No recent activity to show.
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
