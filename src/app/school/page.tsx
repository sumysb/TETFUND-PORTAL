import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getSession } from '@/lib/session';
import { getPgPool } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Upload, AlertCircle, FileText } from 'lucide-react';

export default async function SchoolDashboard() {
    const session = await getSession();
    if (!session) redirect('/');

    const pool = getPgPool();
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [session.userId]);
    const user = userResult.rows[0];

    if (!user) redirect('/');

    // Fetch recent files
    const recentFiles = await pool.query('SELECT * FROM files WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 5', [user.user_id]);

    return (
        <div className="grid-dashboard">
            <Sidebar role="School" />
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <Header user={user} />
                <main className="main-content">
                    <h1 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '32px' }}>School Dashboard</h1>

                    <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                        <Link href="/school/upload" className="btn btn-primary">
                            <Upload size={18} />
                            Upload New Document
                        </Link>
                        <Link href="/school/issues" className="btn btn-secondary">
                            <AlertCircle size={18} style={{ marginRight: '8px' }} />
                            Report Issue
                        </Link>
                    </div>

                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '500', margin: 0 }}>Recent Uploads</h2>
                            <Link href="/school/upload" style={{ fontSize: '14px', color: 'var(--md-sys-color-primary)', textDecoration: 'none', fontWeight: 500 }}>View All</Link>
                        </div>

                        {recentFiles.rows.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                <FileText size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
                                <div>No documents uploaded yet.</div>
                            </div>
                        ) : (
                            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>File Name</th>
                                            <th>Description</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentFiles.rows.map((file: any) => (
                                            <tr key={file.file_id}>
                                                <td style={{ fontWeight: 500 }}>{file.file_name}</td>
                                                <td>{file.description}</td>
                                                <td>{new Date(file.timestamp).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
