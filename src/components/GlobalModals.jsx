
import React from 'react';
import { ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';

const GlobalModals = ({
    showPrivacy, setShowPrivacy,
    showSupport, setShowSupport,
}) => {
    return (
        <>
            {/* Data Protection Modal */}
            {showPrivacy && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 100,
                    background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
                }} onClick={() => setShowPrivacy(false)}>
                    <div style={{
                        background: 'var(--bg-primary)', borderRadius: 24, padding: 40, maxWidth: 600, width: '100%',
                        position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', overflowY: 'auto'
                    }} onClick={e => e.stopPropagation()} className="modal-content">
                        <button
                            onClick={() => setShowPrivacy(false)}
                            style={{
                                position: 'absolute', top: 24, right: 24, background: 'var(--bg-tertiary)', border: 'none',
                                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: 'var(--text-muted-dark)'
                            }}
                        >
                            <ArrowRight style={{ width: 18, height: 18, transform: 'rotate(45deg)' }} />
                        </button>

                        <div style={{ width: 48, height: 48, background: 'var(--bg-accent-dark)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: '#2563EB' }}>
                            <ShieldCheck style={{ width: 24, height: 24 }} />
                        </div>

                        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>Data Protection</h2>
                        <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 24 }}>Your privacy is our priority.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {[
                                'Photos are processed securely.',
                                'No permanent storage of your images.',
                                'No sharing of personal data with third parties.',
                                'Secure browser-based processing for maximum safety.',
                                'SelfieSePassport ensures your images remain private and protected at all times.'
                            ].map((text, i) => (
                                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                    <CheckCircle style={{ width: 18, height: 18, color: '#22C55E', marginTop: 2, flexShrink: 0 }} />
                                    <span style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.5 }}>{text}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowPrivacy(false)}
                            style={{
                                marginTop: 32, width: '100%', background: 'var(--bg-accent-dark)', color: '#fff', border: 'none',
                                padding: '16px', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Support Modal */}
            {showSupport && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 100,
                    background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
                }} onClick={() => setShowSupport(false)}>
                    <div style={{
                        background: 'var(--bg-primary)', borderRadius: 24, padding: 40, maxWidth: 500, width: '100%',
                        position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        textAlign: 'center'
                    }} onClick={e => e.stopPropagation()} className="modal-content">
                        <button
                            onClick={() => setShowSupport(false)}
                            style={{
                                position: 'absolute', top: 24, right: 24, background: 'var(--bg-tertiary)', border: 'none',
                                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: 'var(--text-muted-dark)'
                            }}
                        >
                            <ArrowRight style={{ width: 18, height: 18, transform: 'rotate(45deg)' }} />
                        </button>

                        <div style={{ width: 64, height: 64, background: 'var(--bg-accent-dark)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#2563EB' }}>
                            <div style={{ fontSize: 32 }}>👋</div>
                        </div>

                        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>Need help?</h2>
                        <p style={{ fontSize: 16, color: 'var(--text-muted-dark)', marginBottom: 32 }}>We're here for you.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ fontSize: 24 }}>📱</div>
                                <div style={{ textAlign: 'left' }}>
                                    <p style={{ fontSize: 13, color: 'var(--text-muted-dark)', fontWeight: 600 }}>Contact No</p>
                                    <p style={{ fontSize: 16, color: 'var(--text-primary)', fontWeight: 700 }}>+91 8617371378</p>
                                </div>
                            </div>

                            <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ fontSize: 24 }}>📧</div>
                                <div style={{ textAlign: 'left' }}>
                                    <p style={{ fontSize: 13, color: 'var(--text-muted-dark)', fontWeight: 600 }}>Email</p>
                                    <p style={{ fontSize: 16, color: 'var(--text-primary)', fontWeight: 700 }}>anupmondal345@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowSupport(false)}
                            style={{
                                marginTop: 32, width: '100%', background: 'var(--bg-accent-dark)', color: '#fff', border: 'none',
                                padding: '16px', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default GlobalModals;
