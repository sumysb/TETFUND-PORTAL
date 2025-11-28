import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getSession } from '@/lib/session';
import { getPgPool } from '@/lib/db';
import { redirect } from 'next/navigation';
import IssueForm from '@/components/IssueForm';

export default async function ReportIssuePage() {
    const session = await getSession();
    if (!session || session.role !== 'School') redirect('/');

    const pool = getPgPool();
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [session.userId]);
    const user = userResult.rows[0];

    // Fetch previous issues
    const issues = await pool.query(
        'SELECT * FROM issues WHERE school_id = $1 ORDER BY timestamp DESC',
        [user.user_id]
    );

    return (
        <div className="grid-dashboard">
            <Sidebar role="School" />
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <Header user={user} />
                <main className="main-content">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Report an Issue</h1>

                        <div className="card" style={{ marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>New Issue</h2>
                            <IssueForm schoolId={user.user_id} />
                        </div>

                        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>History</h2>
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {issues.rows.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} style={{ textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                                    No issues reported yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            issues.rows.map((issue: any) => (
                                                <tr key={issue.issue_id}>
                                                    <td>{new Date(issue.timestamp).toLocaleDateString()}</td>
                                                    <td>{issue.issue_description}</td>
                                                    <td>
                                                        <span className={`badge ${issue.status === 'Pending' ? 'badge-pending' :
                                                                issue.status === 'Resolved' ? 'badge-success' : ''
                                                            }`}>
                                                            {issue.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
