import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getSession } from '@/lib/session';
import { getPgPool } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function AdminUsersPage() {
    const session = await getSession();
    if (!session || session.role !== 'Admin') redirect('/');

    const pool = getPgPool();
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [session.userId]);
    const currentUser = userResult.rows[0];

    const allUsers = await pool.query('SELECT * FROM users ORDER BY role, name');

    return (
        <div className="grid-dashboard">
            <Sidebar role="Admin" />
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <Header user={currentUser} />
                <main className="main-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '28px', margin: 0 }}>User Management</h1>
                        <button className="btn btn-primary">+ Add New User</button>
                    </div>

                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.rows.map((u: any) => (
                                        <tr key={u.user_id}>
                                            <td style={{ fontWeight: 500 }}>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className={`badge ${u.role === 'Admin' ? 'badge-error' :
                                                        u.role === 'Department' ? 'badge-pending' : 'badge-success'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn btn-text" style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
