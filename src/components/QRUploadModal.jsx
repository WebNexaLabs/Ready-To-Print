import { useState, useEffect, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Peer from 'peerjs';
import { Smartphone, X, CheckCircle, Wifi, WifiOff, Camera, Copy, Check, QrCode } from 'lucide-react';

export default function QRUploadModal({ onReceive, onClose }) {
    const [peerId, setPeerId] = useState(null);
    const [status, setStatus] = useState('generating'); // 'generating', 'waiting', 'connected', 'done', 'error'
    const [receivedCount, setReceivedCount] = useState(0);
    const [copied, setCopied] = useState(false);
    const peerRef = useRef(null);
    const connRef = useRef(null);

    const handleReceive = useCallback((dataUrl) => {
        onReceive(dataUrl);
        setReceivedCount(c => c + 1);
        setStatus('done');
    }, [onReceive]);

    useEffect(() => {
        const peer = new Peer();
        peerRef.current = peer;

        peer.on('open', (id) => {
            setPeerId(id);
            setStatus('waiting');
        });

        peer.on('connection', (conn) => {
            connRef.current = conn;
            setStatus('connected');

            conn.on('data', (data) => {
                if (data && data.type === 'photo' && data.dataUrl) {
                    handleReceive(data.dataUrl);
                }
            });

            conn.on('close', () => {
                connRef.current = null;
            });
        });

        peer.on('error', (err) => {
            console.error('Peer error:', err);
            if (status === 'generating' || status === 'waiting') {
                setStatus('error');
            }
        });

        return () => {
            if (connRef.current) connRef.current.close();
            peer.destroy();
        };
    }, []);

    const uploadUrl = peerId
        ? `${window.location.origin}${window.location.pathname}?upload=${peerId}`
        : null;

    const handleCopyLink = async () => {
        if (!uploadUrl) return;
        try {
            await navigator.clipboard.writeText(uploadUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* fallback silently */ }
    };

    const statusColor = status === 'done' ? '#22C55E'
        : status === 'connected' ? '#2563EB'
        : status === 'error' ? '#EF4444'
        : '#F59E0B';

    return (
        <div className="qr-modal-overlay" style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} onClick={onClose}>
            <div className="qr-modal-card" style={{
                background: 'var(--bg-primary)', borderRadius: 28, padding: '36px 32px 28px',
                maxWidth: 400, width: '100%',
                position: 'relative',
                boxShadow: '0 0 0 1px var(--border-light), 0 24px 80px -12px rgba(0, 0, 0, 0.6)',
                textAlign: 'center',
                animation: 'qrModalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }} onClick={e => e.stopPropagation()}>

                {/* Close button */}
                <button onClick={onClose} style={{
                    position: 'absolute', top: 14, right: 14,
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
                    width: 34, height: 34, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--text-muted-dark)',
                    transition: 'all 0.15s'
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-muted-dark)'; }}
                >
                    <X style={{ width: 16, height: 16 }} />
                </button>

                {/* Header icon */}
                <div style={{
                    width: 52, height: 52,
                    background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))',
                    borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px', border: '1px solid var(--primary-100)'
                }}>
                    <QrCode style={{ width: 26, height: 26, color: '#2563EB' }} />
                </div>

                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
                    Upload from Phone
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted-dark)', marginBottom: 24, lineHeight: 1.6, maxWidth: 300, margin: '0 auto 24px' }}>
                    Scan the code with your phone camera to send photos directly
                </p>

                {/* QR Code area */}
                {status === 'generating' && (
                    <div style={{
                        width: 220, height: 220, margin: '0 auto 20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--bg-secondary)', borderRadius: 20,
                        border: '1px solid var(--border-light)'
                    }}>
                        <div className="qr-spinner" style={{
                            width: 36, height: 36,
                            border: '3px solid var(--border-light)',
                            borderTopColor: '#2563EB', borderRadius: '50%'
                        }} />
                    </div>
                )}

                {status === 'error' && (
                    <div style={{
                        width: 220, height: 220, margin: '0 auto 20px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--bg-secondary)', borderRadius: 20, gap: 12,
                        border: '1px solid var(--border-light)'
                    }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: '50%',
                            background: 'rgba(239, 68, 68, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <WifiOff style={{ width: 22, height: 22, color: '#EF4444' }} />
                        </div>
                        <p style={{ fontSize: 13, color: '#EF4444', fontWeight: 600 }}>Connection failed</p>
                        <button onClick={() => window.location.reload()} style={{
                            background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)',
                            padding: '8px 18px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.15s'
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                        >Retry</button>
                    </div>
                )}

                {uploadUrl && status !== 'error' && (
                    <div style={{
                        display: 'inline-block', padding: 14, borderRadius: 20,
                        marginBottom: 20, position: 'relative',
                        background: '#FFFFFF',
                        boxShadow: '0 0 0 1px var(--border-light), 0 8px 32px rgba(0, 0, 0, 0.12)',
                    }}>
                        <QRCodeSVG
                            value={uploadUrl}
                            size={188}
                            level="M"
                            includeMargin={false}
                            bgColor="#FFFFFF"
                            fgColor="#0F172A"
                        />
                        {/* Center camera icon */}
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 38, height: 38, 
                            background: '#2563EB', borderRadius: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.35)',
                            border: '3px solid #FFFFFF'
                        }}>
                            <Camera style={{ width: 16, height: 16, color: '#fff' }} />
                        </div>
                    </div>
                )}

                {/* Copy Link alternative */}
                {uploadUrl && status !== 'error' && (
                    <div style={{ marginBottom: 20 }}>
                        <button onClick={handleCopyLink} style={{
                            background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
                            color: copied ? '#22C55E' : 'var(--text-muted-dark)',
                            padding: '8px 18px', borderRadius: 10,
                            fontSize: 12, fontWeight: 600, cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            transition: 'all 0.2s'
                        }}
                            onMouseEnter={e => { if (!copied) e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                        >
                            {copied ? <Check style={{ width: 13, height: 13 }} /> : <Copy style={{ width: 13, height: 13 }} />}
                            {copied ? 'Link Copied!' : 'Copy Link Instead'}
                        </button>
                    </div>
                )}

                {/* Status indicator */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '10px 18px', borderRadius: 12,
                    background: status === 'done' ? 'rgba(34, 197, 94, 0.08)'
                        : status === 'connected' ? 'rgba(59, 130, 246, 0.08)'
                        : status === 'error' ? 'rgba(239, 68, 68, 0.08)'
                        : 'var(--bg-secondary)',
                    border: `1px solid ${status === 'done' ? 'rgba(34, 197, 94, 0.15)'
                        : status === 'connected' ? 'rgba(59, 130, 246, 0.15)'
                        : status === 'error' ? 'rgba(239, 68, 68, 0.15)'
                        : 'var(--border-light)'}`,
                    marginBottom: 20, transition: 'all 0.3s ease'
                }}>
                    {status === 'generating' && (
                        <>
                            <div className="qr-spinner" style={{
                                width: 14, height: 14,
                                border: '2px solid var(--border-light)',
                                borderTopColor: 'var(--text-muted-dark)', borderRadius: '50%'
                            }} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted-dark)' }}>
                                Setting up connection...
                            </span>
                        </>
                    )}
                    {status === 'waiting' && (
                        <>
                            <div className="qr-pulse-dot" style={{
                                width: 8, height: 8, borderRadius: '50%', background: '#F59E0B',
                                flexShrink: 0
                            }} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted-dark)' }}>
                                Waiting for phone to connect...
                            </span>
                        </>
                    )}
                    {status === 'connected' && (
                        <>
                            <Wifi style={{ width: 15, height: 15, color: '#2563EB', flexShrink: 0 }} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#2563EB' }}>
                                Phone connected — select photos to send
                            </span>
                        </>
                    )}
                    {status === 'done' && (
                        <>
                            <CheckCircle style={{ width: 15, height: 15, color: '#22C55E', flexShrink: 0 }} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#22C55E' }}>
                                {receivedCount} photo{receivedCount !== 1 ? 's' : ''} received
                            </span>
                        </>
                    )}
                </div>

                {/* Steps guide */}
                <div style={{
                    display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16
                }}>
                    {[
                        { icon: <QrCode style={{ width: 13, height: 13 }} />, text: 'Scan QR' },
                        { icon: <Camera style={{ width: 13, height: 13 }} />, text: 'Take Photo' },
                        { icon: <CheckCircle style={{ width: 13, height: 13 }} />, text: 'Auto-Sent' }
                    ].map((step, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '5px 10px', borderRadius: 8,
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-light)'
                        }}>
                            <span style={{ color: '#2563EB', display: 'flex' }}>{step.icon}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-disabled)', letterSpacing: '0.02em' }}>{step.text}</span>
                        </div>
                    ))}
                </div>

                <p style={{ fontSize: 11, color: 'var(--text-disabled)', lineHeight: 1.5, opacity: 0.8 }}>
                    Peer-to-peer via WebRTC · No server storage
                </p>
            </div>

            <style>{`
                @keyframes qrModalIn {
                    from { opacity: 0; transform: scale(0.95) translateY(8px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .qr-spinner {
                    animation: qrSpin 0.8s linear infinite;
                }
                @keyframes qrSpin {
                    to { transform: rotate(360deg); }
                }
                .qr-pulse-dot {
                    animation: qrPulse 2s ease-in-out infinite;
                }
                @keyframes qrPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(0.85); }
                }
                .qr-modal-card {
                    border: 1px solid var(--border-light);
                }
                @media (max-width: 480px) {
                    .qr-modal-card {
                        padding: 28px 20px 22px !important;
                        border-radius: 22px !important;
                        margin: 8px;
                    }
                }
            `}</style>
        </div>
    );
}
