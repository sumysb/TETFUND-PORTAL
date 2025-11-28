import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getSession } from '@/lib/session';
import { getPgPool } from '@/lib/db';
import { redirect } from 'next/navigation';
import MessageForm from '@/components/MessageForm';

export default async function MessagesPage() {
    const session = await getSession();
    if (!session) redirect('/');

    const pool = getPgPool();
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [session.userId]);
    const user = userResult.rows[0];

    // Fetch potential receivers (Departments if School, Schools if Department)
    let receiverRole = user.role === 'School' ? 'Department' : 'School';
    if (user.role === 'Admin') receiverRole = 'Department'; // Admin can msg depts? Simplification.

    const receivers = await pool.query('SELECT user_id, name, role FROM users WHERE role = $1', [receiverRole]);

    // Fetch messages
    const messages = await pool.query(`
    SELECT m.*, u.name as sender_name, r.name as receiver_name
    FROM messages m 
    JOIN users u ON m.sender_id = u.user_id 
    JOIN users r ON m.receiver_id = r.user_id
    WHERE m.receiver_id = $1 OR m.sender_id = $1 
    ORDER BY m.timestamp DESC
  `, [session.userId]);

    return (
        <div className="grid-dashboard">
            <Sidebar role={user.role} />
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <Header user={user} />
                <main className="main-content">
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <h1 style={{ fontSize: '28px', marginBottom: '32px' }}>Messages</h1>

                        <div className="card" style={{ marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>New Message</h2>
                            <MessageForm senderId={user.user_id} receivers={receivers.rows} />
                        </div>

                        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Inbox</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {messages.rows.length === 0 ? (
                                <div className="card" style={{ textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                    No messages found.
                                </div>
                            ) : (
                                messages.rows.map((msg: any) => {
                                    const isMe = msg.sender_id === user.user_id;
                                    return (
                                        <div key={msg.message_id} className="card" style={{
                                            borderLeft: isMe ? '4px solid var(--md-sys-color-primary)' : '4px solid var(--md-sys-color-tertiary)',
                                            backgroundColor: isMe ? 'var(--md-sys-color-surface)' : '#f1f8e9'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <div style={{ fontWeight: 600, color: 'var(--md-sys-color-on-surface)' }}>
                                                    {isMe ? `To: ${msg.receiver_name}` : `From: ${msg.sender_name}`}
                                                </div>
                                                <div style={{ fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                                    {new Date(msg.timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                            <div style={{ color: 'var(--md-sys-color-on-surface)', lineHeight: '1.6' }}>
                                                {msg.message_text}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
