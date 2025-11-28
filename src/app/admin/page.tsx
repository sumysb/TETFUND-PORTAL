import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getSession } from '@/lib/session';
import { getPgPool } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
    const session = await getSession();
    if (!session) redirect('/');

    const pool = getPgPool();
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [session.userId]);
    const user = userResult.rows[0];

    if (!user) redirect('/');

    // Fetch stats
    const usersCount = (await pool.query('SELECT COUNT(*) FROM users')).rows[0].count;
    const filesCount = (await pool.query('SELECT COUNT(*) FROM files')).rows[0].count;
    const issuesCount = (await pool.query('SELECT COUNT(*) FROM issues WHERE status = \'Pending\'')).rows[0].count;

    return (
        <div className="grid-dashboard">
            <Sidebar role="Admin" />
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <Header user={user} />
                <main className="main-content">
                    <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '32px' }}>System Overview</h1>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '50%',
                                backgroundColor: 'var(--md-sys-color-primary-container)',
                                color: 'var(--md-sys-color-on-primary-container)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '24px'
                            }}>
                                👥
                            </div>
                            <div>
                                <div className="label" style={{ fontSize: '14px', marginLeft: 0 }}>Total Users</div>
                                <div style={{ fontSize: '36px', fontWeight: '500', color: 'var(--md-sys-color-on-surface)' }}>{usersCount}</div>
                            </div>
                        </div>

                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '50%',
                                backgroundColor: 'var(--md-sys-color-tertiary-container)',
                                color: 'var(--md-sys-color-on-tertiary-container)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '24px'
                            }}>
                                📁
                            </div>
                            <div>
                                <div className="label" style={{ fontSize: '14px', marginLeft: 0 }}>Total Files</div>
                                <div style={{ fontSize: '36px', fontWeight: '500', color: 'var(--md-sys-color-on-surface)' }}>{filesCount}</div>
                            </div>
                        </div>

                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '50%',
                                backgroundColor: 'var(--md-sys-color-error-container)',
                                color: 'var(--md-sys-color-on-error-container)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '24px'
                            }}>
                                ⚠️
                            </div>
                            <div>
                                <div className="label" style={{ fontSize: '14px', marginLeft: 0 }}>Pending Issues</div>
                                <div style={{ fontSize: '36px', fontWeight: '500', color: 'var(--md-sys-color-on-surface)' }}>{issuesCount}</div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '16px' }}>Recent Activity</h2>
                        <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '14px', padding: '16px', textAlign: 'center', border: '1px dashed var(--md-sys-color-outline-variant)', borderRadius: '8px' }}>
                            System is running smoothly. No critical alerts.
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
