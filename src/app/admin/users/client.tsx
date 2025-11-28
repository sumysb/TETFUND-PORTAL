'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useState } from 'react';
import AddUserModal from '@/components/AddUserModal';

export default function AdminUsersClient({ user, allUsers }: { user: any, allUsers: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="grid-dashboard">
            <Sidebar role="Admin" />
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <Header user={user} />
                <main className="main-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '28px', margin: 0 }}>User Management</h1>
                        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">+ Add New User</button>
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
                                    {allUsers.map((u: any) => (
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
            <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
