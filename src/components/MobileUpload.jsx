import { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { Camera, Upload, CheckCircle, Smartphone, ImagePlus, X } from 'lucide-react';

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
            minHeight: '100vh', background: 'var(--bg-primary)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: 24, fontFamily: "'Inter', sans-serif"
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
                <div style={{
                    width: 36, height: 36, background: '#2563EB', borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                }}>
                    <Camera style={{ width: 20, height: 20 }} />
                </div>
                <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
                    SelfieSe<span style={{ color: '#2563EB' }}>Passport</span>
                </span>
            </div>

            <div style={{
                background: 'var(--bg-secondary)', borderRadius: 24, padding: 32,
                maxWidth: 400, width: '100%', textAlign: 'center',
                border: '1px solid var(--border-light)'
            }}>
                <div style={{
                    width: 64, height: 64, background: 'var(--bg-accent-dark)', borderRadius: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', color: '#2563EB'
                }}>
                    <Smartphone style={{ width: 32, height: 32 }} />
                </div>

                <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                    Upload Photos
                </h1>
                <p style={{ fontSize: 14, color: 'var(--text-muted-dark)', marginBottom: 24, lineHeight: 1.6 }}>
                    Take or select photos to send directly to your desktop browser
                </p>

                {/* Connecting state */}
                {status === 'connecting' && (
                    <div style={{ padding: 32 }}>
                        <div style={{
                            width: 48, height: 48, margin: '0 auto 16px',
                            border: '3px solid var(--border-light)', borderTopColor: '#2563EB',
                            borderRadius: '50%', animation: 'spin 1s linear infinite'
                        }}></div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-muted-dark)' }}>
                            Connecting to desktop...
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--text-disabled)', marginTop: 8 }}>
                            Make sure the QR code modal is still open on your computer
                        </p>
                    </div>
                )}

                {/* Error state */}
                {status === 'error' && (
                    <div style={{ padding: 24 }}>
                        <div style={{
                            width: 48, height: 48, margin: '0 auto 16px', borderRadius: '50%',
                            background: 'rgba(239, 68, 68, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <X style={{ width: 24, height: 24, color: '#EF4444' }} />
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: '#EF4444', marginBottom: 8 }}>
                            Connection Failed
                        </p>
                        <p style={{ fontSize: 13, color: 'var(--text-muted-dark)', marginBottom: 20, lineHeight: 1.5 }}>
                            The session may have expired. Go back to your computer and generate a new QR code.
                        </p>
                        <button onClick={() => window.location.reload()} style={{
                            background: '#2563EB', color: '#fff', border: 'none',
                            padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                            cursor: 'pointer'
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

                        {/* Take Photo button (opens camera) */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={sendingFile}
                            style={{
                                width: '100%', background: '#2563EB', color: '#fff', border: 'none',
                                padding: '16px 24px', borderRadius: 14, fontWeight: 700, fontSize: 16,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                boxShadow: '0 4px 14px rgba(37,99,235,0.3)', marginBottom: 12,
                                opacity: sendingFile ? 0.7 : 1
                            }}
                        >
                            <Camera style={{ width: 20, height: 20 }} />
                            {sendingFile ? 'Sending...' : 'Take Photo'}
                        </button>

                        {/* Gallery button */}
                        <button
                            onClick={() => galleryInputRef.current?.click()}
                            disabled={sendingFile}
                            style={{
                                width: '100%', background: 'var(--bg-primary)', color: 'var(--text-primary)',
                                border: '1px solid var(--border-light)',
                                padding: '16px 24px', borderRadius: 14, fontWeight: 700, fontSize: 16,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                opacity: sendingFile ? 0.7 : 1
                            }}
                        >
                            <Upload style={{ width: 20, height: 20 }} />
                            Choose from Gallery
                        </button>

                        {/* Sent previews */}
                        {previews.length > 0 && (
                            <div style={{ marginTop: 20 }}>
                                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, textAlign: 'left' }}>
                                    Sent Photos ({previews.length})
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                                    {previews.map((p, i) => (
                                        <div key={i} style={{
                                            position: 'relative', aspectRatio: '3/4', borderRadius: 10,
                                            overflow: 'hidden', border: '2px solid var(--border-light)'
                                        }}>
                                            <img src={p} alt={`Sent ${i + 1}`} style={{
                                                width: '100%', height: '100%', objectFit: 'cover'
                                            }} />
                                            <div style={{
                                                position: 'absolute', top: 4, right: 4,
                                                width: 20, height: 20, borderRadius: '50%',
                                                background: '#22C55E', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center'
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
                                padding: '12px 20px', borderRadius: 12,
                                background: 'rgba(34, 197, 94, 0.1)', marginTop: 16
                            }}>
                                <CheckCircle style={{ width: 18, height: 18, color: '#22C55E' }} />
                                <span style={{ fontSize: 14, fontWeight: 600, color: '#22C55E' }}>
                                    {sentCount} photo{sentCount !== 1 ? 's' : ''} sent to desktop!
                                </span>
                            </div>
                        )}

                        {/* Connection indicator */}
                        <div style={{
                            marginTop: 16, padding: '10px 16px', background: 'var(--bg-accent-dark)',
                            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                        }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%', background: '#22C55E',
                                boxShadow: '0 0 6px rgba(34, 197, 94, 0.5)',
                                animation: 'pulse 2s infinite'
                            }}></div>
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted-dark)' }}>
                                Connected to desktop
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* Footer info */}
            <div style={{
                marginTop: 24, maxWidth: 400, textAlign: 'center'
            }}>
                <p style={{ fontSize: 11, color: 'var(--text-disabled)', lineHeight: 1.6 }}>
                    Photos are sent directly to your desktop browser via WebRTC.<br />
                    No images are stored on any server. Connection is end-to-end encrypted.
                </p>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}
