'use client';

import { sendMessage } from '@/app/actions/messages';
import { useActionState } from 'react';
import { Send } from 'lucide-react';

export default function MessageForm({ senderId, receivers }: { senderId: number, receivers: any[] }) {
    const [state, action, isPending] = useActionState(sendMessage, null);

    return (
        <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <input type="hidden" name="senderId" value={senderId} />

            <div style={{
                position: 'relative',
                border: '1px solid #747775',
                borderRadius: '4px',
                padding: '0 13px',
                height: '56px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <select
                    name="receiverId"
                    required
                    style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        fontSize: '16px',
                        color: '#1f1f1f',
                        background: 'transparent',
                        height: '100%',
                        appearance: 'none', /* Remove default arrow to style if needed, but keeping simple for now */
                        zIndex: 1
                    }}
                >
                    <option value="" disabled selected hidden></option> {/* Placeholder trick */}
                    {receivers.map((r) => (
                        <option key={r.user_id} value={r.user_id}>{r.name} ({r.role})</option>
                    ))}
                </select>
                <label style={{
                    position: 'absolute',
                    left: '12px',
                    top: '-10px',
                    backgroundColor: 'white',
                    padding: '0 4px',
                    fontSize: '12px',
                    color: '#1f1f1f'
                }}>
                    To:
                </label>
                {/* Custom arrow could go here */}
                <div style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#444746"><path d="M7 10l5 5 5-5z" /></svg>
                </div>
            </div>

            <div style={{
                position: 'relative',
                border: '1px solid #747775',
                borderRadius: '4px',
                padding: '13px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <textarea
                    name="message"
                    required
                    rows={3}
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
                    Message
                </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, marginRight: '16px' }}>
                    {state?.message && <span style={{ color: '#146c2e', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>{state.message}</span>}
                    {state?.error && <span style={{ color: '#b3261e', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>{state.error}</span>}
                </div>
                <button type="submit" disabled={isPending} className="btn btn-primary" style={{
                    height: '40px',
                    padding: '0 24px',
                    borderRadius: '20px',
                    fontWeight: 500,
                    fontSize: '14px',
                    backgroundColor: '#0b57d0',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Send size={18} />
                    {isPending ? 'Sending...' : 'Send'}
                </button>
            </div>
        </form>
    );
}
