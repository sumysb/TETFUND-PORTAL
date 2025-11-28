'use client';

import { reportIssue } from '@/app/actions/issues';
import { useActionState } from 'react';

export default function IssueForm({ schoolId }: { schoolId: number }) {
    const [state, action, isPending] = useActionState(reportIssue, null);

    return (
        <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <input type="hidden" name="schoolId" value={schoolId} />

            <div style={{
                position: 'relative',
                border: '1px solid #747775',
                borderRadius: '4px',
                padding: '13px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <textarea
                    name="description"
                    required
                    rows={6}
                    placeholder=" "
                    style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        fontSize: '16px',
                        color: '#1f1f1f',
                        background: 'transparent',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        zIndex: 1
                    }}
                />
                <label style={{
                    position: 'absolute',
                    left: '12px',
                    top: '-10px',
                    backgroundColor: 'white',
                    padding: '0 4px',
                    fontSize: '12px',
                    color: '#1f1f1f'
                }}>
                    Issue Description
                </label>
            </div>

            {state?.message && (
                <div style={{
                    padding: '12px',
                    backgroundColor: 'var(--md-sys-color-tertiary-container)',
                    color: 'var(--md-sys-color-on-tertiary-container)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                    {state.message}
                </div>
            )}

            {state?.error && (
                <div style={{
                    padding: '12px',
                    backgroundColor: 'var(--md-sys-color-error-container)',
                    color: 'var(--md-sys-color-on-error-container)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                    {state.error}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={isPending} className="btn btn-primary" style={{
                    height: '40px',
                    padding: '0 24px',
                    borderRadius: '20px',
                    fontWeight: 500,
                    fontSize: '14px',
                    backgroundColor: '#0b57d0',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                    {isPending ? 'Submitting...' : 'Submit Issue'}
                </button>
            </div>
        </form>
    );
}
