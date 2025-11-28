'use client';

import { updateIssueStatus } from '@/app/actions/issues';
import { useState } from 'react';

export default function IssueStatusUpdater({ issueId, currentStatus }: { issueId: number, currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true);
        await updateIssueStatus(issueId, newStatus);
        setStatus(newStatus);
        setIsUpdating(false);
    };

    return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isUpdating}
                style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--md-sys-color-outline)',
                    fontSize: '12px',
                    backgroundColor: 'transparent'
                }}
            >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
            </select>
            {isUpdating && <span style={{ fontSize: '10px', color: 'var(--md-sys-color-primary)' }}>Saving...</span>}
        </div>
    );
}
