'use client';

import { useActionState, useEffect } from 'react';
import { addUser } from '@/app/actions/users';
import { X } from 'lucide-react';

export default function AddUserModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [state, action, isPending] = useActionState(addUser, null);

    useEffect(() => {
        if (state?.success) {
            onClose();
        }
    }, [state, onClose]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <X size={24} color="var(--md-sys-color-on-surface-variant)" />
                </button>

                <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Add New User</h2>

                <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="input-group">
                        <label className="label">Full Name</label>
                        <input name="name" type="text" required className="input-field" placeholder="e.g. University of Abuja" />
                    </div>

                    <div className="input-group">
                        <label className="label">Email Address</label>
                        <input name="email" type="email" required className="input-field" placeholder="e.g. uniabuja@edu.ng" />
                    </div>

                    <div className="input-group">
                        <label className="label">Password</label>
                        <input name="password" type="password" required className="input-field" placeholder="••••••••" />
                    </div>

                    <div className="input-group">
                        <label className="label">Role</label>
                        <select name="role" className="input-field" required>
                            <option value="School">School</option>
                            <option value="Department">Department</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    {state?.error && (
                        <div style={{ color: 'var(--md-sys-color-error)', fontSize: '14px' }}>
                            {state.error}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                        <button type="submit" disabled={isPending} className="btn btn-primary">
                            {isPending ? 'Adding...' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
