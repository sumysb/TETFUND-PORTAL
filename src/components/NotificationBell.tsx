'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { getUserNotifications, markNotificationAsRead } from '@/app/actions/notifications';

export default function NotificationBell({ userId }: { userId: number }) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        const data = await getUserNotifications(userId);
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => n.status === 'unread').length);
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [userId]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const handleMarkAsRead = async (id: number) => {
        await markNotificationAsRead(id);
        setNotifications(notifications.map(n =>
            n.notification_id === id ? { ...n, status: 'read' } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    position: 'relative',
                    padding: '8px'
                }}
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        backgroundColor: 'var(--md-sys-color-error)',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        minWidth: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid var(--md-sys-color-surface)'
                    }}>
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    width: '320px',
                    backgroundColor: 'var(--md-sys-color-surface)',
                    borderRadius: '8px',
                    boxShadow: 'var(--md-sys-elevation-2)',
                    border: '1px solid var(--md-sys-color-outline-variant)',
                    zIndex: 100,
                    maxHeight: '400px',
                    overflowY: 'auto'
                }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--md-sys-color-outline-variant)', fontWeight: 500 }}>
                        Notifications
                    </div>
                    {notifications.length === 0 ? (
                        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)', fontSize: '14px' }}>
                            No notifications
                        </div>
                    ) : (
                        <div>
                            {notifications.map((notification) => (
                                <div
                                    key={notification.notification_id}
                                    onClick={() => notification.status === 'unread' && handleMarkAsRead(notification.notification_id)}
                                    style={{
                                        padding: '12px 16px',
                                        borderBottom: '1px solid var(--md-sys-color-outline-variant)',
                                        backgroundColor: notification.status === 'unread' ? 'var(--md-sys-color-secondary-container)' : 'transparent',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px', color: 'var(--md-sys-color-on-surface)' }}>
                                        {notification.type}
                                    </div>
                                    <div style={{ fontSize: '14px', color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '4px' }}>
                                        {notification.message}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--md-sys-color-outline)' }}>
                                        {new Date(notification.created_at).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
