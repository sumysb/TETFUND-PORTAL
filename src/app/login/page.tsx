import LoginForm from '@/components/LoginForm';
import Link from 'next/link';
import { Suspense } from 'react';

export default function LoginPage(props: { searchParams: Promise<{ role?: string }> }) {
    return (
        <Suspense fallback={<div className="flex-center" style={{ minHeight: '100vh' }}>Loading...</div>}>
            <LoginContent searchParams={props.searchParams} />
        </Suspense>
    );
}

async function LoginContent({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
    const params = await searchParams;
    const role = params?.role || 'Admin';

    return (
        <div className="flex-center" style={{ minHeight: '100vh', backgroundColor: '#f0f4f9' }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '450px',
                padding: '48px 40px 36px',
                borderRadius: '28px', /* Google M3 radius */
                boxShadow: 'none', /* Google login often flat or subtle */
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{ marginBottom: '16px' }}>
                    <img
                        src="/assets/logo.png"
                        alt="TETFUND"
                        style={{ height: '48px', objectFit: 'contain' }}
                    />
                </div>

                <h1 style={{
                    fontSize: '24px',
                    fontWeight: '400',
                    marginBottom: '8px',
                    color: '#1f1f1f',
                    fontFamily: "'Google Sans', Roboto, Arial, sans-serif"
                }}>
                    Sign in
                </h1>

                <p style={{
                    color: '#1f1f1f',
                    fontSize: '16px',
                    marginBottom: '40px',
                    textAlign: 'center'
                }}>
                    to continue to {role} Portal
                </p>

                <LoginForm role={role} />

                <div style={{ marginTop: '40px', textAlign: 'center', width: '100%' }}>
                    <Link href="/" style={{
                        color: 'var(--md-sys-color-primary)',
                        fontSize: '14px',
                        textDecoration: 'none',
                        fontWeight: 500
                    }}>
                        Change account type
                    </Link>
                </div>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '24px',
                display: 'flex',
                gap: '24px',
                fontSize: '12px',
                color: '#444746'
            }}>
                <span>English (United States)</span>
                <span>Help</span>
                <span>Privacy</span>
                <span>Terms</span>
            </div>
        </div>
    );
}
