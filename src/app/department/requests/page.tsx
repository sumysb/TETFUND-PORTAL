import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getSession } from '@/lib/session';
import { getPgPool } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function DepartmentRequestsPage() {
    const session = await getSession();
    if (!session || session.role !== 'Department') redirect('/');

    const pool = getPgPool();
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [session.userId]);
    const user = userResult.rows[0];

    // Fetch files uploaded by schools
    const files = await pool.query(`
    SELECT f.*, u.name as school_name 
    FROM files f 
    JOIN users u ON f.user_id = u.user_id 
    WHERE u.role = 'School' 
    ORDER BY f.timestamp DESC
  `);

    return (
        <div className="grid-dashboard">
            <Sidebar role="Department" />
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <Header user={user} />
                <main className="main-content">
                    <h1 style={{ fontSize: '28px', marginBottom: '32px' }}>School Requests & Files</h1>

                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>School</th>
                                        <th>File Name</th>
                                        <th>Description</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {files.rows.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                                No files received yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        files.rows.map((file: any) => (
                                            <tr key={file.file_id}>
                                                <td style={{ fontWeight: 500 }}>{file.school_name}</td>
                                                <td>{file.file_name}</td>
                                                <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {file.description}
                                                </td>
                                                <td>{new Date(file.timestamp).toLocaleDateString()}</td>
                                                <td>
                                                    <a href={file.file_path} download className="btn btn-text" style={{ fontSize: '12px' }}>Download</a>
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
