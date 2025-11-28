'use client';

import { useActionState } from 'react';
import { login } from '@/app/actions/auth';

export default function LoginForm({ role }: { role: string }) {
    const [state, action, isPending] = useActionState(login, null);

    return (
        <form action={action} style={{ width: '100%' }}>
            <input type="hidden" name="role" value={role} />

            <div style={{ marginBottom: '24px' }}>
                <div style={{
                    position: 'relative',
                    border: '1px solid #747775',
                    borderRadius: '4px',
                    padding: '8px 13px',
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder=" " /* Important for label float trick if using CSS, but here we just keep it simple */
                        style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            fontSize: '16px',
                            color: '#1f1f1f',
                            height: '100%',
                            background: 'transparent',
                            zIndex: 1
                        }}
                    />
                    <label htmlFor="email" style={{
                        position: 'absolute',
                        left: '12px',
                        top: '-10px',
                        backgroundColor: 'white',
                        padding: '0 4px',
                        fontSize: '12px',
                        color: '#1f1f1f'
                    }}>
                        Email or phone
                    </label>
                </div>
            </div>

            <div style={{ marginBottom: '8px' }}>
                <div style={{
                    position: 'relative',
                    border: '1px solid #747775',
                    borderRadius: '4px',
                    padding: '8px 13px',
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            fontSize: '16px',
                            color: '#1f1f1f',
                            height: '100%',
                            background: 'transparent'
                        }}
                    />
                    <label htmlFor="password" style={{
                        position: 'absolute',
                        left: '12px',
                        top: '-10px',
                        backgroundColor: 'white',
                        padding: '0 4px',
                        fontSize: '12px',
                        color: '#1f1f1f'
                    }}>
                        Enter your password
                    </label>
                </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
                <a href="#" style={{ color: '#0b57d0', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Forgot password?</a>
            </div>

            {state?.error && (
                <div style={{
                    padding: '12px',
                    color: '#b3261e',
                    fontSize: '14px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#b3261e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                    {state.error}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={isPending} className="btn btn-primary" style={{
                    height: '40px',
                    padding: '0 24px',
                    fontSize: '14px',
                    fontWeight: 500,
                    borderRadius: '20px'
                }}>
                    {isPending ? 'Next...' : 'Next'}
                </button>
            </div>
        </form>
    );
}
