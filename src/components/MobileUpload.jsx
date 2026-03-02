import { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { Camera, Upload, CheckCircle, Smartphone, ImagePlus, X, Wifi, WifiOff } from 'lucide-react';

const MAX_DIM = 2048; // Max dimension to resize to before sending

function resizeImage(dataUrl, maxDim) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const { naturalWidth: w, naturalHeight: h } = img;
            // Skip resize if already small
            if (w <= maxDim && h <= maxDim) {
                resolve(dataUrl);
                return;
            }
            const scale = maxDim / Math.max(w, h);
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(w * scale);
            canvas.height = Math.round(h * scale);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.92));
        };
        img.src = dataUrl;
    });
}

export default function MobileUpload({ peerId }) {
    const [status, setStatus] = useState('connecting'); // 'connecting', 'ready', 'sending', 'sent', 'error'
    const [sentCount, setSentCount] = useState(0);
    const [sendingFile, setSendingFile] = useState(false);
    const [previews, setPreviews] = useState([]);
    const connRef = useRef(null);
    const fileInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    useEffect(() => {
        const peer = new Peer();

        peer.on('open', () => {
            const conn = peer.connect(peerId, { reliable: true });
            connRef.current = conn;

            conn.on('open', () => {
                setStatus('ready');
            });

            conn.on('error', (err) => {
                console.error('Connection error:', err);
                setStatus('error');
            });

            conn.on('close', () => {
                connRef.current = null;
            });
        });

        peer.on('error', (err) => {
            console.error('Peer error:', err);
            setStatus('error');
        });

        // Timeout: if not connected after 15s, show error
        const timeout = setTimeout(() => {
            if (!connRef.current || !connRef.current.open) {
                setStatus(s => s === 'connecting' ? 'error' : s);
            }
        }, 15000);

        return () => {
            clearTimeout(timeout);
            peer.destroy();
        };
    }, [peerId]);

    const sendPhoto = async (dataUrl) => {
        if (!connRef.current || !connRef.current.open) {
            alert('Not connected to desktop. Please scan the QR code again.');
            return;
        }
        setSendingFile(true);
        try {
            const resized = await resizeImage(dataUrl, MAX_DIM);
            connRef.current.send({ type: 'photo', dataUrl: resized });
            setSentCount(c => c + 1);
            setStatus('sent');
        } catch (err) {
            console.error('Send error:', err);
        }
        setSendingFile(false);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
        if (files.length === 0) return;

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = async (ev) => {
                const dataUrl = ev.target.result;
                setPreviews(prev => [...prev, dataUrl]);
                await sendPhoto(dataUrl);
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };

    const removePreview = (index) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const isConnected = status === 'ready' || status === 'sent' || status === 'sending';

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-start', padding: '48px 20px 32px',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
                <div style={{
                    width: 34, height: 34, background: '#2563EB', borderRadius: 9,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                }}>
                    <Camera style={{ width: 18, height: 18 }} />
                </div>
                <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
                    SelfieSe<span style={{ color: '#2563EB' }}>Passport</span>
                </span>
            </div>

            {/* Main card */}
            <div style={{
                background: 'var(--bg-secondary)', borderRadius: 24, padding: '28px 24px',
                maxWidth: 400, width: '100%', textAlign: 'center',
                border: '1px solid var(--border-light)',
                boxShadow: '0 8px 40px rgba(0, 0, 0, 0.15)'
            }}>
                {/* Header icon */}
                <div style={{
                    width: 56, height: 56,
                    background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))',
                    borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px', border: '1px solid var(--primary-100)'
                }}>
                    <Smartphone style={{ width: 28, height: 28, color: '#2563EB' }} />
                </div>

                <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
                    Upload Photos
                </h1>
                <p style={{ fontSize: 13, color: 'var(--text-muted-dark)', marginBottom: 24, lineHeight: 1.6 }}>
                    Take or select photos to send directly to your desktop
                </p>

                {/* Connecting state */}
                {status === 'connecting' && (
                    <div style={{ padding: '24px 0' }}>
                        <div className="mu-spinner" style={{
                            width: 44, height: 44, margin: '0 auto 16px',
                            border: '3px solid var(--border-light)', borderTopColor: '#2563EB',
                            borderRadius: '50%'
                        }} />
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted-dark)' }}>
                            Connecting to desktop...
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--text-disabled)', marginTop: 8, lineHeight: 1.5 }}>
                            Keep the QR code modal open on your computer
                        </p>
                    </div>
                )}

                {/* Error state */}
                {status === 'error' && (
                    <div style={{ padding: '20px 0' }}>
                        <div style={{
                            width: 52, height: 52, margin: '0 auto 16px', borderRadius: '50%',
                            background: 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid rgba(239, 68, 68, 0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <WifiOff style={{ width: 24, height: 24, color: '#EF4444' }} />
                        </div>
                        <p style={{ fontSize: 16, fontWeight: 700, color: '#EF4444', marginBottom: 8 }}>
                            Connection Failed
                        </p>
                        <p style={{ fontSize: 13, color: 'var(--text-muted-dark)', marginBottom: 20, lineHeight: 1.5 }}>
                            Session may have expired. Generate a new QR code on your computer.
                        </p>
                        <button onClick={() => window.location.reload()} style={{
                            background: '#2563EB', color: '#fff', border: 'none',
                            padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 700,
                            cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
                        }}>
                            Try Again
                        </button>
                    </div>
                )}

                {/* Connected — upload buttons */}
                {isConnected && (
                    <>
                        {/* Hidden inputs */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            multiple
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <input
                            ref={galleryInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />

                        {/* Take Photo button */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={sendingFile}
                            style={{
                                width: '100%', background: '#2563EB', color: '#fff', border: 'none',
                                padding: '15px 24px', borderRadius: 14, fontWeight: 700, fontSize: 15,
                                cursor: sendingFile ? 'wait' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)', marginBottom: 10,
                                opacity: sendingFile ? 0.7 : 1, transition: 'opacity 0.2s'
                            }}
                        >
                            <Camera style={{ width: 19, height: 19 }} />
                            {sendingFile ? 'Sending...' : 'Take Photo'}
                        </button>

                        {/* Gallery button */}
                        <button
                            onClick={() => galleryInputRef.current?.click()}
                            disabled={sendingFile}
                            style={{
                                width: '100%',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-light)',
                                padding: '15px 24px', borderRadius: 14, fontWeight: 700, fontSize: 15,
                                cursor: sendingFile ? 'wait' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                opacity: sendingFile ? 0.7 : 1, transition: 'opacity 0.2s'
                            }}
                        >
                            <Upload style={{ width: 19, height: 19 }} />
                            Choose from Gallery
                        </button>

                        {/* Sent previews */}
                        {previews.length > 0 && (
                            <div style={{ marginTop: 20 }}>
                                <p style={{
                                    fontSize: 12, fontWeight: 700, color: 'var(--text-muted-dark)',
                                    marginBottom: 10, textAlign: 'left',
                                    textTransform: 'uppercase', letterSpacing: '0.05em'
                                }}>
                                    Sent ({previews.length})
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                                    {previews.map((p, i) => (
                                        <div key={i} style={{
                                            position: 'relative', aspectRatio: '3/4', borderRadius: 12,
                                            overflow: 'hidden', border: '2px solid var(--border-light)',
                                            background: 'var(--bg-primary)'
                                        }}>
                                            <img src={p} alt={`Sent ${i + 1}`} style={{
                                                width: '100%', height: '100%', objectFit: 'cover'
                                            }} />
                                            <div style={{
                                                position: 'absolute', top: 5, right: 5,
                                                width: 20, height: 20, borderRadius: '50%',
                                                background: '#22C55E',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                                            }}>
                                                <CheckCircle style={{ width: 12, height: 12, color: '#fff' }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sent count badge */}
                        {sentCount > 0 && (
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                padding: '10px 18px', borderRadius: 12,
                                background: 'rgba(34, 197, 94, 0.08)',
                                border: '1px solid rgba(34, 197, 94, 0.15)',
                                marginTop: 14
                            }}>
                                <CheckCircle style={{ width: 16, height: 16, color: '#22C55E' }} />
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#22C55E' }}>
                                    {sentCount} photo{sentCount !== 1 ? 's' : ''} sent to desktop
                                </span>
                            </div>
                        )}

                        {/* Connection indicator */}
                        <div style={{
                            marginTop: 14, padding: '9px 14px',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-light)',
                            borderRadius: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                        }}>
                            <div className="mu-pulse-dot" style={{
                                width: 7, height: 7, borderRadius: '50%', background: '#22C55E',
                                boxShadow: '0 0 6px rgba(34, 197, 94, 0.4)', flexShrink: 0
                            }} />
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-disabled)' }}>
                                Connected to desktop
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* Footer */}
            <div style={{ marginTop: 20, maxWidth: 400, textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: 'var(--text-disabled)', lineHeight: 1.6, opacity: 0.8 }}>
                    Peer-to-peer via WebRTC · End-to-end encrypted · No server storage
                </p>
            </div>

            <style>{`
                .mu-spinner {
                    animation: muSpin 0.8s linear infinite;
                }
                @keyframes muSpin {
                    to { transform: rotate(360deg); }
                }
                .mu-pulse-dot {
                    animation: muPulse 2s ease-in-out infinite;
                }
                @keyframes muPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(0.85); }
                }
            `}</style>
        </div>
    );
}
