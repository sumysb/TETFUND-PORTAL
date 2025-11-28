import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getSession } from '@/lib/session';
import { getPgPool } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function AdminIssuesPage() {
    const session = await getSession();
    if (!session || session.role !== 'Admin') redirect('/');

    const pool = getPgPool();
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [session.userId]);
    const user = userResult.rows[0];

    // Fetch all issues with reporter info
    const issues = await pool.query(`
    SELECT i.*, u.name as reporter_name, u.role as reporter_role
    FROM issues i
    JOIN users u ON i.school_id = u.user_id
    ORDER BY i.timestamp DESC
  `);

    return (
        <div className="grid-dashboard">
            <Sidebar role="Admin" />
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <Header user={user} />
                <main className="main-content">
                    <h1 style={{ fontSize: '28px', marginBottom: '32px' }}>System Issues</h1>

                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Reporter</th>
                                        <th>Role</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {issues.rows.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                                No issues reported.
                                            </td>
                                        </tr>
                                    ) : (
                                        issues.rows.map((issue: any) => (
                                            <tr key={issue.issue_id}>
                                                <td style={{ fontWeight: 500 }}>{issue.reporter_name}</td>
                                                <td>
                                                    <span className="badge badge-pending">{issue.reporter_role}</span>
                                                </td>
                                                <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {issue.issue_description}
                                                </td>
                                                <td>
                                                    <span className={`badge ${issue.status === 'Pending' ? 'badge-error' :
                                                            issue.status === 'Resolved' ? 'badge-success' : 'badge-pending'
                                                        }`}>
                                                        {issue.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(issue.timestamp).toLocaleDateString()}</td>
                                                <td>
                                                    <button className="btn btn-text" style={{ fontSize: '12px' }}>View</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
