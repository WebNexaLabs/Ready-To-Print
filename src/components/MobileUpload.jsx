import { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { Camera, Upload, CheckCircle, Smartphone, ImagePlus, X, Wifi, WifiOff, Image, Send, ArrowRight } from 'lucide-react';

const MAX_DIM = 2048; // Max dimension to resize to before sending

function resizeImage(dataUrl, maxDim) {
    return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => {
            const { naturalWidth: w, naturalHeight: h } = img;
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
    const [selectedPhotos, setSelectedPhotos] = useState([]); // photos chosen but not yet sent
    const [sentPhotos, setSentPhotos] = useState([]); // photos successfully sent
    const connRef = useRef(null);
    const peerRef = useRef(null);
    const galleryInputRef = useRef(null);

    useEffect(() => {
        const peerConfig = {
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' },
                    { urls: 'stun:stun.cloudflare.com:3478' },
                ]
            }
        };
        const peer = new Peer(undefined, peerConfig);
        peerRef.current = peer;

        peer.on('open', () => {
            const conn = peer.connect(peerId, { reliable: true });
            connRef.current = conn;

            conn.on('open', () => {
                console.log('Connected to desktop peer');
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

        const timeout = setTimeout(() => {
            if (!connRef.current || !connRef.current.open) {
                setStatus(s => s === 'connecting' ? 'error' : s);
            }
        }, 20000);

        return () => {
            clearTimeout(timeout);
            peer.destroy();
        };
    }, [peerId]);

    // Select files — just preview, don't send yet
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
        if (files.length === 0) return;

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setSelectedPhotos(prev => [...prev, ev.target.result]);
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };

    const removeSelected = (index) => {
        setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
    };

    // Send all selected photos
    const handleSend = async () => {
        if (!connRef.current || !connRef.current.open) {
            alert('Not connected to desktop. Please scan the QR code again.');
            return;
        }
        if (selectedPhotos.length === 0) return;

        setSendingFile(true);
        for (const photo of selectedPhotos) {
            try {
                const resized = await resizeImage(photo, MAX_DIM);
                console.log('Sending photo, length:', resized.length);
                connRef.current.send({ type: 'photo', dataUrl: resized });
                setSentPhotos(prev => [...prev, photo]);
                setSentCount(c => c + 1);
            } catch (err) {
                console.error('Send error:', err);
            }
        }
        setSelectedPhotos([]);
        setStatus('sent');
        setSendingFile(false);
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
                    Select photos from your gallery to send directly to your desktop
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
                        {/* Hidden input */}
                        <input
                            ref={galleryInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />

                        {/* Choose from Gallery button */}
                        <button
                            onClick={() => galleryInputRef.current?.click()}
                            disabled={sendingFile}
                            style={{
                                width: '100%', background: 'var(--bg-primary)', color: 'var(--text-primary)', 
                                border: '2px dashed var(--border-light)',
                                padding: '15px 24px', borderRadius: 14, fontWeight: 700, fontSize: 15,
                                cursor: sendingFile ? 'wait' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                opacity: sendingFile ? 0.7 : 1, transition: 'opacity 0.2s'
                            }}
                        >
                            <ImagePlus style={{ width: 19, height: 19 }} />
                            Select Photos
                        </button>

                        {/* Selected photos preview (not yet sent) */}
                        {selectedPhotos.length > 0 && (
                            <div style={{ marginTop: 16 }}>
                                <p style={{
                                    fontSize: 12, fontWeight: 700, color: 'var(--text-muted-dark)',
                                    marginBottom: 10, textAlign: 'left',
                                    textTransform: 'uppercase', letterSpacing: '0.05em'
                                }}>
                                    Selected ({selectedPhotos.length})
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                                    {selectedPhotos.map((p, i) => (
                                        <div key={i} style={{
                                            position: 'relative', aspectRatio: '3/4', borderRadius: 12,
                                            overflow: 'hidden', border: '2px solid #2563EB',
                                            background: 'var(--bg-primary)'
                                        }}>
                                            <img src={p} alt={`Selected ${i + 1}`} style={{
                                                width: '100%', height: '100%', objectFit: 'cover'
                                            }} />
                                            <button
                                                onClick={() => removeSelected(i)}
                                                style={{
                                                    position: 'absolute', top: 4, right: 4,
                                                    width: 22, height: 22, borderRadius: '50%',
                                                    background: 'rgba(0,0,0,0.6)', border: 'none',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer', padding: 0
                                                }}
                                            >
                                                <X style={{ width: 12, height: 12, color: '#fff' }} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* SEND BUTTON */}
                                <button
                                    onClick={handleSend}
                                    disabled={sendingFile}
                                    style={{
                                        width: '100%', marginTop: 12,
                                        background: sendingFile ? '#1D4ED8' : '#2563EB', color: '#fff', border: 'none',
                                        padding: '15px 24px', borderRadius: 14, fontWeight: 700, fontSize: 15,
                                        cursor: sendingFile ? 'wait' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                        boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)',
                                        opacity: sendingFile ? 0.8 : 1, transition: 'all 0.2s'
                                    }}
                                >
                                    {sendingFile ? (
                                        <>
                                            <div className="mu-spinner" style={{
                                                width: 18, height: 18,
                                                border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
                                                borderRadius: '50%'
                                            }} />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send style={{ width: 18, height: 18 }} />
                                            Send {selectedPhotos.length} Photo{selectedPhotos.length !== 1 ? 's' : ''} to Desktop
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Sent photos */}
                        {sentPhotos.length > 0 && (
                            <div style={{ marginTop: 20 }}>
                                <p style={{
                                    fontSize: 12, fontWeight: 700, color: '#22C55E',
                                    marginBottom: 10, textAlign: 'left',
                                    textTransform: 'uppercase', letterSpacing: '0.05em'
                                }}>
                                    Sent ({sentPhotos.length})
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                                    {sentPhotos.map((p, i) => (
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
                        {sentCount > 0 && selectedPhotos.length === 0 && (
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
