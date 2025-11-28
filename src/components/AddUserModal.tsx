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
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '400px',
                position: 'relative',
                padding: '24px',
                borderRadius: '28px',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)'
            }}>
                <div style={{ marginBottom: '16px' }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '400',
                        margin: 0,
                        color: '#1f1f1f',
                        fontFamily: "'Google Sans', Roboto, Arial, sans-serif"
                    }}>
                        Add new user
                    </h2>
                    <p style={{ fontSize: '14px', color: '#444746', marginTop: '8px' }}>
                        Enter details to create a new account
                    </p>
                </div>

                <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    <div style={{
                        position: 'relative',
                        border: '1px solid #747775',
                        borderRadius: '4px',
                        padding: '8px 13px',
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <input name="name" type="text" required placeholder=" " style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px', color: '#1f1f1f', height: '100%', background: 'transparent', zIndex: 1 }} />
                        <label style={{ position: 'absolute', left: '12px', top: '-10px', backgroundColor: 'white', padding: '0 4px', fontSize: '12px', color: '#1f1f1f' }}>Full Name</label>
                    </div>

                    <div style={{
                        position: 'relative',
                        border: '1px solid #747775',
                        borderRadius: '4px',
                        padding: '8px 13px',
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <input name="email" type="email" required placeholder=" " style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px', color: '#1f1f1f', height: '100%', background: 'transparent', zIndex: 1 }} />
                        <label style={{ position: 'absolute', left: '12px', top: '-10px', backgroundColor: 'white', padding: '0 4px', fontSize: '12px', color: '#1f1f1f' }}>Email Address</label>
                    </div>

                    <div style={{
                        position: 'relative',
                        border: '1px solid #747775',
                        borderRadius: '4px',
                        padding: '8px 13px',
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <input name="password" type="password" required placeholder=" " style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px', color: '#1f1f1f', height: '100%', background: 'transparent', zIndex: 1 }} />
                        <label style={{ position: 'absolute', left: '12px', top: '-10px', backgroundColor: 'white', padding: '0 4px', fontSize: '12px', color: '#1f1f1f' }}>Password</label>
                    </div>

                    <div style={{
                        position: 'relative',
                        border: '1px solid #747775',
                        borderRadius: '4px',
                        padding: '0 13px',
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <select name="role" required style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px', color: '#1f1f1f', background: 'transparent', height: '100%' }}>
                            <option value="School">School</option>
                            <option value="Department">Department</option>
                            <option value="Admin">Admin</option>
                        </select>
                        <label style={{ position: 'absolute', left: '12px', top: '-10px', backgroundColor: 'white', padding: '0 4px', fontSize: '12px', color: '#1f1f1f' }}>Role</label>
                    </div>

                    {state?.error && (
                        <div style={{ color: '#b3261e', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#b3261e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                            {state.error}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                        <button type="button" onClick={onClose} style={{
                            background: 'none',
                            border: 'none',
                            color: '#0b57d0',
                            fontWeight: 500,
                            padding: '0 24px',
                            height: '40px',
                            borderRadius: '20px',
                            cursor: 'pointer'
                        }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={isPending} style={{
                            backgroundColor: '#0b57d0',
                            color: 'white',
                            border: 'none',
                            fontWeight: 500,
                            padding: '0 24px',
                            height: '40px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }}>
                            {isPending ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
