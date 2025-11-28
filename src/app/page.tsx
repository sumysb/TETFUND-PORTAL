import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '32px', background: 'linear-gradient(180deg, #eef2ff 0%, #ffffff 100%)' }}>
      <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, var(--md-sys-color-primary), var(--md-sys-color-secondary))',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '32px',
          margin: '0 auto 24px auto',
          boxShadow: 'var(--md-sys-elevation-3)'
        }}>T</div>
        <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '16px', color: '#1e1b4b', letterSpacing: '-0.5px' }}>
          TETFUND Portal
        </h1>
        <p style={{ color: '#475569', fontSize: '18px', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
          Secure Communication and File-Management Platform for Tertiary Institutions
        </p>
      </div>

      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '40px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '32px', textAlign: 'center', color: '#334155' }}>
          Select your role to continue
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Link href="/login?role=Admin" className="btn btn-secondary" style={{ justifyContent: 'space-between', height: '56px', fontSize: '16px', borderColor: '#e2e8f0', color: '#334155' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🛡️</span> Admin
            </span>
            <span style={{ color: '#cbd5e1' }}>→</span>
          </Link>

          <Link href="/login?role=Department" className="btn btn-secondary" style={{ justifyContent: 'space-between', height: '56px', fontSize: '16px', borderColor: '#e2e8f0', color: '#334155' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🏢</span> Department
            </span>
            <span style={{ color: '#cbd5e1' }}>→</span>
          </Link>

          <Link href="/login?role=School" className="btn btn-secondary" style={{ justifyContent: 'space-between', height: '56px', fontSize: '16px', borderColor: '#e2e8f0', color: '#334155' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🎓</span> School
            </span>
            <span style={{ color: '#cbd5e1' }}>→</span>
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '32px', color: '#94a3b8', fontSize: '13px' }}>
        &copy; 2024 TETFUND. All rights reserved.
      </div>
    </div>
  );
}
