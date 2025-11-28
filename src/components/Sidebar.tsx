'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    FileText,
    AlertCircle,
    Upload,
    MessageSquare,
    Home,
    LogOut,
    Settings
} from 'lucide-react';

export default function Sidebar({ role }: { role: string }) {
    const pathname = usePathname();

    const iconMap: any = {
        'Overview': LayoutDashboard,
        'User Management': Users,
        'All Files': FileText,
        'System Issues': AlertCircle,
        'Dashboard': Home,
        'School Requests': MessageSquare,
        'My Files': FileText,
        'Upload Document': Upload,
        'Messages': MessageSquare,
        'Report Issue': AlertCircle
    };

    const links = {
        Admin: [
            { href: '/admin', label: 'Overview' },
            { href: '/admin/users', label: 'User Management' },
            { href: '/admin/files', label: 'All Files' },
            { href: '/admin/issues', label: 'System Issues' },
        ],
        Department: [
            { href: '/department', label: 'Dashboard' },
            { href: '/department/requests', label: 'School Requests' },
            { href: '/department/files', label: 'My Files' },
        ],
        School: [
            { href: '/school', label: 'Dashboard' },
            { href: '/school/upload', label: 'Upload Document' },
            { href: '/school/messages', label: 'Messages' },
            { href: '/school/issues', label: 'Report Issue' },
        ]
    };

    const currentLinks = links[role as keyof typeof links] || [];

    return (
        <div className="sidebar">
            <div style={{ padding: '0 12px 32px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, var(--md-sys-color-primary), var(--md-sys-color-secondary))',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                }}>T</div>
                <span style={{ fontSize: '20px', fontWeight: '500', color: 'var(--md-sys-color-on-surface)', fontFamily: 'var(--font-family-brand)' }}>
                    TETFUND
                </span>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <div style={{ padding: '0 12px', marginBottom: '8px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--md-sys-color-on-surface-variant)', letterSpacing: '0.5px' }}>
                    Menu
                </div>
                {currentLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = iconMap[link.label] || Home;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                padding: '12px 16px',
                                borderRadius: '24px', /* Pill shape */
                                backgroundColor: isActive ? 'var(--md-sys-color-secondary-container)' : 'transparent',
                                color: isActive ? 'var(--md-sys-color-on-secondary-container)' : 'var(--md-sys-color-on-surface-variant)',
                                fontWeight: isActive ? 600 : 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                textDecoration: 'none',
                                transition: 'background-color 0.2s ease'
                            }}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div style={{ borderTop: '1px solid var(--md-sys-color-outline-variant)', paddingTop: '16px', marginTop: '16px' }}>
                <div style={{ padding: '0 12px', fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    &copy; 2024 TETFUND Portal
                </div>
            </div>
        </div>
    );
}
