'use client';

import { reportIssue } from '@/app/actions/issues';
import { useActionState } from 'react';

export default function IssueForm({ schoolId }: { schoolId: number }) {
    const [state, action, isPending] = useActionState(reportIssue, null);

    return (
        <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <input type="hidden" name="schoolId" value={schoolId} />

            <div className="input-group">
                <label className="label">Issue Description</label>
                <textarea
                    name="description"
                    required
                    className="input-field"
                    rows={6}
                    placeholder="Describe the issue in detail..."
                    style={{ resize: 'vertical' }}
                />
            </div>

            {state?.message && (
                <div style={{
                    padding: '12px',
                    backgroundColor: 'var(--md-sys-color-tertiary-container)',
                    color: 'var(--md-sys-color-on-tertiary-container)',
                    borderRadius: '8px',
                    fontSize: '14px'
                }}>
                    {state.message}
                </div>
            )}

            {state?.error && (
                <div style={{
                    padding: '12px',
                    backgroundColor: 'var(--md-sys-color-error-container)',
                    color: 'var(--md-sys-color-on-error-container)',
                    borderRadius: '8px',
                    fontSize: '14px'
                }}>
                    {state.error}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={isPending} className="btn btn-primary">
                    {isPending ? 'Submitting...' : 'Submit Issue'}
                </button>
            </div>
        </form>
    );
}
