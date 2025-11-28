'use client';

import { uploadFile } from '@/app/actions/files';
import { useActionState } from 'react';

export default function UploadForm({ userId }: { userId: number }) {
    const [state, action, isPending] = useActionState(uploadFile, null);

    return (
        <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="hidden" name="userId" value={userId} />

            <div>
                <label className="label">Document Title</label>
                <input name="title" type="text" required className="input-field" placeholder="e.g., Annual Report 2024" />
            </div>

            <div>
                <label className="label">Description</label>
                <textarea name="description" className="input-field" rows={4} placeholder="Brief description..." style={{ fontFamily: 'inherit' }} />
            </div>

            <div>
                <label className="label">Select File</label>
                <input name="file" type="file" required className="input-field" style={{ padding: '8px' }} />
            </div>

            {state?.message && <div style={{ color: 'var(--success-color)', fontSize: '14px' }}>{state.message}</div>}
            {state?.error && <div style={{ color: 'var(--error-color)', fontSize: '14px' }}>{state.error}</div>}

            <button type="submit" disabled={isPending} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                {isPending ? 'Uploading...' : 'Upload Document'}
            </button>
        </form>
    );
}
