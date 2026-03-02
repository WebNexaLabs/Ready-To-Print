import React from 'react';
import { Smile, Sun, Image as ImageIcon, Shirt, Glasses, User, Smartphone, CheckCircle } from 'lucide-react';

const PhotoGuidelines = () => {
    const guidelines = [
        {
            icon: <Smile style={{ width: 32, height: 32, color: '#2563EB' }} />,
            title: "Face & Expression",
            points: [
                "Look straight at the camera.",
                "Keep a neutral expression (no smiling or frowning).",
                "Both eyes must be clearly visible and open.",
                "Mouth closed."
            ]
        },
        {
            icon: <Sun style={{ width: 32, height: 32, color: '#F59E0B' }} />,
            title: "Lighting",
            points: [
                "Use even, natural lighting.",
                "Avoid shadows on the face or background.",
                "No overexposure or dark areas.",
                "Avoid flash reflections."
            ]
        },
        {
            icon: <ImageIcon style={{ width: 32, height: 32, color: '#10B981' }} />,
            title: "Background",
            points: [
                "Plain white or light-colored background.",
                "No patterns, textures, or objects behind you.",
                "No shadows on the wall."
            ]
        },
        {
            icon: <Shirt style={{ width: 32, height: 32, color: '#8B5CF6' }} />,
            title: "Clothing",
            points: [
                "Wear simple, solid-colored clothes.",
                "Avoid white clothing (it may blend with the background).",
                "No uniforms unless required for religious reasons.",
                "No flashy accessories."
            ]
        },
        {
            icon: <Glasses style={{ width: 32, height: 32, color: '#EC4899' }} />,
            title: "Accessories",
            points: [
                "No sunglasses or tinted glasses.",
                "Clear glasses allowed (no glare).",
                "Head coverings allowed only for religious purposes (face must be fully visible).",
                "No large earrings or distracting accessories."
            ]
        },
        {
            icon: <User style={{ width: 32, height: 32, color: '#6366F1' }} />,
            title: "Positioning & Framing",
            points: [
                "Head centered in the frame.",
                "Full face clearly visible.",
                "Shoulders included.",
                "No tilting of head.",
                "Keep proper distance — not too close, not too far."
            ]
        },
        {
            icon: <Smartphone style={{ width: 32, height: 32, color: '#14B8A6' }} />,
            title: "Photo Quality",
            points: [
                "Use a high-resolution image.",
                "No filters or beauty effects.",
                "No blur or pixelation.",
                "Avoid screenshots or compressed images."
            ]
        }
    ];

    return (
        <div className="guidelines-page" style={{ maxWidth: 1350, margin: '0 auto', padding: '60px 24px', fontFamily: "'Inter', sans-serif" }}>
            <div className="guidelines-header" style={{ textAlign: 'center', marginBottom: 60 }}>
                <h1 style={{ fontSize: 42, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>
                    Photo <span style={{ color: '#2563EB' }}>Guidelines</span>
                </h1>
                <p style={{ fontSize: 18, color: 'var(--text-muted-dark)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
                    Follow these simple rules to ensure your passport photo is approved first time.
                </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32 }}>
                {guidelines.map((section, index) => (
                    <div key={index} className="guideline-card" style={{
                        background: 'var(--bg-primary)', borderRadius: 24, padding: 32,
                        border: '1px solid var(--border-light)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        transition: 'transform 0.2s',
                        cursor: 'default',
                        display: 'flex', flexDirection: 'column'
                    }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: 16, background: 'var(--bg-secondary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                {section.icon}
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{section.title}</h3>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {section.points.map((point, i) => (
                                <li key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                                    <CheckCircle style={{ width: 18, height: 18, color: '#22C55E', flexShrink: 0, marginTop: 3 }} />
                                    <span style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.5 }}>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <style>{`
                .guideline-card {
                    width: calc(25% - 24px);
                }
                @media (max-width: 1024px) {
                    .guideline-card {
                        width: calc(50% - 16px);
                    }
                }
                @media (max-width: 640px) {
                    .guideline-card {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default PhotoGuidelines;
