'use client';

import { sendMessage } from '@/app/actions/messages';
import { useActionState } from 'react';
import { Send } from 'lucide-react';

export default function MessageForm({ senderId, receivers }: { senderId: number, receivers: any[] }) {
    const [state, action, isPending] = useActionState(sendMessage, null);

    return (
        <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="hidden" name="senderId" value={senderId} />

            <div className="input-group">
                <label className="label">To:</label>
                <select name="receiverId" className="input-field" required>
                    <option value="">Select Recipient</option>
                    {receivers.map((r) => (
                        <option key={r.user_id} value={r.user_id}>{r.name} ({r.role})</option>
                    ))}
                </select>
            </div>

            <div className="input-group">
                <label className="label">Message</label>
                <textarea
                    name="message"
                    required
                    className="input-field"
                    rows={3}
                    placeholder="Type your message..."
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    {state?.message && <span style={{ color: 'var(--md-sys-color-tertiary)', fontSize: '14px' }}>{state.message}</span>}
                    {state?.error && <span style={{ color: 'var(--md-sys-color-error)', fontSize: '14px' }}>{state.error}</span>}
                </div>
                <button type="submit" disabled={isPending} className="btn btn-primary">
                    <Send size={18} />
                    {isPending ? 'Sending...' : 'Send'}
                </button>
            </div>
        </form>
    );
}
