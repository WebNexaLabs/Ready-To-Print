import { useState, useEffect, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Peer from 'peerjs';
import { Smartphone, X, CheckCircle, Wifi, WifiOff, Camera } from 'lucide-react';

export default function QRUploadModal({ onReceive, onClose }) {
    const [peerId, setPeerId] = useState(null);
    const [status, setStatus] = useState('generating'); // 'generating', 'waiting', 'connected', 'done', 'error'
    const [receivedCount, setReceivedCount] = useState(0);
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

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} onClick={onClose}>
            <div className="modal-content" style={{
                background: 'var(--bg-primary)', borderRadius: 24, padding: 40, maxWidth: 420, width: '100%',
                position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                textAlign: 'center'
            }} onClick={e => e.stopPropagation()}>
                {/* Close */}
                <button onClick={onClose} style={{
                    position: 'absolute', top: 16, right: 16, background: 'var(--bg-tertiary)', border: 'none',
                    width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--text-muted-dark)'
                }}>
                    <X style={{ width: 18, height: 18 }} />
                </button>

                {/* Icon */}
                <div style={{
                    width: 56, height: 56, background: 'var(--bg-accent-dark)', borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', color: '#2563EB'
                }}>
                    <Smartphone style={{ width: 28, height: 28 }} />
                </div>

                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                    Upload from Phone
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted-dark)', marginBottom: 24, lineHeight: 1.6 }}>
                    Scan this QR code with your phone camera to upload photos directly to this session
                </p>

                {/* QR Code area */}
                {status === 'generating' && (
                    <div style={{
                        width: 216, height: 216, margin: '0 auto 24px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--bg-secondary)', borderRadius: 16
                    }}>
                        <div style={{
                            width: 32, height: 32, border: '3px solid var(--border-light)',
                            borderTopColor: '#2563EB', borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                    </div>
                )}

                {status === 'error' && (
                    <div style={{
                        width: 216, height: 216, margin: '0 auto 24px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--bg-secondary)', borderRadius: 16, gap: 12
                    }}>
                        <WifiOff style={{ width: 32, height: 32, color: '#EF4444' }} />
                        <p style={{ fontSize: 13, color: '#EF4444', fontWeight: 600 }}>Connection failed</p>
                        <button onClick={() => window.location.reload()} style={{
                            background: '#EF4444', color: '#fff', border: 'none', padding: '8px 16px',
                            borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer'
                        }}>Retry</button>
                    </div>
                )}

                {uploadUrl && status !== 'error' && (
                    <div style={{
                        display: 'inline-block', padding: 16, background: '#FFFFFF', borderRadius: 16,
                        marginBottom: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        border: '1px solid #E2E8F0', position: 'relative'
                    }}>
                        <QRCodeSVG
                            value={uploadUrl}
                            size={184}
                            level="M"
                            includeMargin={false}
                            imageSettings={{
                                src: '',
                                height: 0,
                                width: 0,
                                excavate: false,
                            }}
                        />
                        {/* Overlay logo in center */}
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 36, height: 36, background: '#2563EB', borderRadius: 8,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(37,99,235,0.3)'
                        }}>
                            <Camera style={{ width: 18, height: 18, color: '#fff' }} />
                        </div>
                    </div>
                )}

                {/* Status indicator */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px 20px', borderRadius: 12,
                    background: status === 'done' ? 'rgba(34, 197, 94, 0.1)'
                        : status === 'connected' ? 'rgba(59, 130, 246, 0.1)'
                            : 'var(--bg-secondary)',
                    marginBottom: 16, transition: 'background 0.3s'
                }}>
                    {status === 'waiting' && (
                        <>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%', background: '#F59E0B',
                                animation: 'pulse 2s infinite'
                            }}></div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted-dark)' }}>
                                Waiting for phone to connect...
                            </span>
                        </>
                    )}
                    {status === 'connected' && (
                        <>
                            <Wifi style={{ width: 16, height: 16, color: '#2563EB' }} />
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#2563EB' }}>
                                Phone connected! Select photos to send.
                            </span>
                        </>
                    )}
                    {status === 'done' && (
                        <>
                            <CheckCircle style={{ width: 16, height: 16, color: '#22C55E' }} />
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#22C55E' }}>
                                {receivedCount} photo{receivedCount !== 1 ? 's' : ''} received!
                            </span>
                        </>
                    )}
                </div>

                {/* Steps */}
                <div style={{
                    display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 20
                }}>
                    {[
                        { num: '1', text: 'Scan QR' },
                        { num: '2', text: 'Take Photo' },
                        { num: '3', text: 'Auto-Sent' }
                    ].map((step, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: '50%',
                                background: 'var(--bg-accent-dark)', color: '#2563EB',
                                fontSize: 12, fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>{step.num}</div>
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-disabled)' }}>{step.text}</span>
                        </div>
                    ))}
                </div>

                <p style={{ fontSize: 11, color: 'var(--text-disabled)', lineHeight: 1.5 }}>
                    Photos are transferred peer-to-peer via WebRTC.<br />
                    No data is stored on any server.
                </p>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
