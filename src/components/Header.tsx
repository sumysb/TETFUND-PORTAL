'use client';

import NotificationBell from '@/components/NotificationBell';
import { Search } from 'lucide-react';
import { logout } from '@/app/actions/auth';

export default function Header({ user }: { user: any }) {
    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 32px',
            backgroundColor: 'var(--md-sys-color-surface)',
            borderBottom: '1px solid var(--md-sys-color-outline-variant)',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--md-sys-color-on-surface-variant)' }} />
                    <input
                        type="text"
                        placeholder="Search..."
                        style={{
                            width: '100%',
                            padding: '10px 12px 10px 40px',
                            borderRadius: '24px',
                            border: 'none',
                            backgroundColor: 'var(--md-sys-color-background)',
                            fontSize: '14px'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <NotificationBell userId={user.user_id} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--md-sys-color-on-surface)' }}>{user.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>{user.role}</div>
                    </div>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--md-sys-color-primary-container)',
                        color: 'var(--md-sys-color-on-primary-container)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                    }}>
                        {user.name.charAt(0)}
                    </div>

                    <button
                        onClick={() => logout()}
                        className="btn btn-text"
                        style={{ fontSize: '13px', color: 'var(--md-sys-color-error)' }}
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </header>
    );
}
