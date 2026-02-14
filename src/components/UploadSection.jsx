import { useState, useRef } from 'react';
import { Upload, Camera, X, ImagePlus } from 'lucide-react';

const MAX_PHOTOS = 7;

export default function UploadSection({ onUpload }) {
    const [isDragging, setIsDragging] = useState(false);
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        addFiles(files);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
        addFiles(files);
        e.target.value = ''; // reset so same file can be re-selected
    };

    const addFiles = (files) => {
        const remaining = MAX_PHOTOS - images.length;
        if (remaining <= 0) {
            alert(`Maximum ${MAX_PHOTOS} photos allowed.`);
            return;
        }
        const toAdd = files.slice(0, remaining);

        toAdd.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImages(prev => {
                    if (prev.length >= MAX_PHOTOS) return prev;
                    return [...prev, e.target.result];
                });
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleContinue = () => {
        if (images.length === 0) return;
        onUpload(images);
    };

    return (
        <div>
            {/* Upload Drop Zone */}
            <div
                style={{
                    position: 'relative', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', width: '100%', padding: '32px 16px',
                    borderRadius: 16, border: `2px dashed ${isDragging ? '#3B82F6' : '#CBD5E1'}`,
                    background: isDragging ? '#EFF6FF' : '#fff',
                    transition: 'all 0.3s'
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                />

                <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: isDragging ? '#DBEAFE' : '#F1F5F9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16, transition: 'all 0.3s'
                }}>
                    <Upload style={{ width: 24, height: 24, color: '#2563EB' }} />
                </div>

                <p style={{ fontWeight: 600, fontSize: 16, color: '#0F172A', marginBottom: 4 }}>
                    Upload Your Photos
                </p>
                <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>
                    Select up to {MAX_PHOTOS} photos — drag & drop or click to browse
                </p>

                <button
                    style={{
                        background: '#2563EB', color: '#fff', border: 'none',
                        padding: '10px 28px', borderRadius: 999, fontWeight: 600,
                        fontSize: 14, cursor: 'pointer', display: 'flex',
                        alignItems: 'center', gap: 8,
                        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                    }}
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                    <Camera style={{ width: 16, height: 16 }} />
                    Select Images
                </button>

                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    {['JPG', 'PNG', 'HEIC'].map(fmt => (
                        <span key={fmt} style={{
                            fontSize: 11, fontWeight: 700, color: '#94A3B8',
                            background: '#F8FAFC', padding: '2px 10px', borderRadius: 4,
                            border: '1px solid #E2E8F0', letterSpacing: '0.05em'
                        }}>{fmt}</span>
                    ))}
                </div>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div style={{ marginTop: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                            {images.length} / {MAX_PHOTOS} photos selected
                        </p>
                        {images.length < MAX_PHOTOS && (
                            <button
                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                style={{
                                    background: 'none', border: '1px solid #E2E8F0', padding: '4px 12px',
                                    borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#2563EB',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                                }}
                            >
                                <ImagePlus style={{ width: 14, height: 14 }} /> Add More
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                        {images.map((img, i) => (
                            <div key={i} style={{
                                position: 'relative', borderRadius: 10, overflow: 'hidden',
                                border: '2px solid #E2E8F0', aspectRatio: '3/4'
                            }}>
                                <img src={img} alt={`Photo ${i + 1}`} style={{
                                    width: '100%', height: '100%', objectFit: 'cover'
                                }} />
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                                    style={{
                                        position: 'absolute', top: 4, right: 4,
                                        width: 22, height: 22, borderRadius: '50%',
                                        background: 'rgba(0,0,0,0.6)', color: '#fff',
                                        border: 'none', cursor: 'pointer', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', padding: 0
                                    }}
                                >
                                    <X style={{ width: 12, height: 12 }} />
                                </button>
                                <div style={{
                                    position: 'absolute', bottom: 4, left: 4,
                                    background: 'rgba(0,0,0,0.6)', color: '#fff',
                                    padding: '1px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700
                                }}>{i + 1}</div>
                            </div>
                        ))}
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={handleContinue}
                        style={{
                            width: '100%', marginTop: 16, background: '#2563EB', color: '#fff',
                            border: 'none', padding: '14px 24px', borderRadius: 12,
                            fontWeight: 700, fontSize: 15, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
                        }}
                    >
                        Continue with {images.length} Photo{images.length > 1 ? 's' : ''} →
                    </button>
                </div>
            )}
        </div>
    );
}
