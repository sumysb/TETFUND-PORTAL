'use client';

import { uploadFile } from '@/app/actions/files';
import { useActionState } from 'react';

export default function UploadForm({ userId }: { userId: number }) {
    const [state, action, isPending] = useActionState(uploadFile, null);

    return (
        <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <input type="hidden" name="userId" value={userId} />

            {/* Document Title */}
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
                    name="title"
                    type="text"
                    required
                    placeholder=" "
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
                <label style={{
                    position: 'absolute',
                    left: '12px',
                    top: '-10px',
                    backgroundColor: 'white',
                    padding: '0 4px',
                    fontSize: '12px',
                    color: '#1f1f1f'
                }}>
                    Document Title
                </label>
            </div>

            {/* Description */}
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
                    rows={4}
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
                    Description
                </label>
            </div>

            {/* File Input */}
            <div style={{
                position: 'relative',
                border: '1px dashed #747775',
                borderRadius: '4px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f9fa',
                cursor: 'pointer'
            }}>
                <input
                    name="file"
                    type="file"
                    required
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                    }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#444746' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                    </svg>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Click to select a file</span>
                    <span style={{ fontSize: '12px' }}>or drag and drop here</span>
                </div>
            </div>

            {state?.message && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#146c2e',
                    fontSize: '14px',
                    backgroundColor: '#c4eed0',
                    padding: '8px 12px',
                    borderRadius: '8px'
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                    {state.message}
                </div>
            )}
            {state?.error && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#b3261e',
                    fontSize: '14px',
                    backgroundColor: '#f9dedc',
                    padding: '8px 12px',
                    borderRadius: '8px'
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                    {state.error}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button
                    type="submit"
                    disabled={isPending}
                    className="btn btn-primary"
                    style={{
                        height: '40px',
                        padding: '0 24px',
                        borderRadius: '20px',
                        fontWeight: 500,
                        fontSize: '14px',
                        backgroundColor: '#0b57d0',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        opacity: isPending ? 0.7 : 1
                    }}
                >
                    {isPending ? (
                        <>
                            <span style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid white',
                                borderTopColor: 'transparent',
                                borderRadius: '50%',
                                display: 'inline-block',
                                animation: 'spin 1s linear infinite'
                            }}></span>
                            Uploading...
                        </>
                    ) : (
                        <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                                <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
                            </svg>
                            Upload
                        </>
                    )}
                </button>
            </div>
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </form>
    );
}
