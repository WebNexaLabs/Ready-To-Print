import React, { useState, useEffect } from 'react';
import { Check, X, ShieldCheck, Truck, Zap, Info, ArrowRight, Printer, Star, Camera } from 'lucide-react';

const Pricing = ({ onOrder }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Standard and Professional plan details
    const standardFeatures = [
        '12 Passport Photos',
        'Premium Glossy/Matte Finish',
        'Secure Cardboard Packaging',
        'Pan-India Doorstep Delivery'
    ];

    const professionalFeatures = [
        { text: 'Up to 42 Passport Photos', bold: true },
        { text: 'Ultra-High Premium Paper', bold: false },
        { text: 'Professional Color Grading', bold: false },
        { text: 'Priority Express Delivery', bold: false }
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter', sans-serif", paddingBottom: 80 }}>
            {/* Header */}
            <div style={{ background: '#EFF6FF', padding: '60px 24px 40px', textAlign: 'center' }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>
                        Professional Prints, <span style={{ color: '#2563EB' }}>Delivered to Your Doorstep</span>
                    </h1>
                    <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.6, maxWidth: 600, margin: '0 auto' }}>
                        Premium quality passport and document photos printed on high-grade photo paper. Pan-India delivery within 3-5 business days.
                    </p>
                </div>
            </div>

            {/* Pricing Cards */}
            <div style={{ maxWidth: 1000, margin: '-20px auto 60px', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>

                {/* Standard Plan */}
                <div style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                        <div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>Standard Sheet</h3>
                            <span style={{ fontSize: 12, fontWeight: 600, background: '#F1F5F9', color: '#475569', padding: '4px 10px', borderRadius: 999 }}>4" × 6" Photo Paper</span>
                        </div>
                        <Printer style={{ color: '#94A3B8', width: 24, height: 24 }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 36, fontWeight: 800, color: '#0F172A' }}>₹64</span>
                        <span style={{ fontSize: 16, color: '#94A3B8', textDecoration: 'line-through' }}>₹99</span>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 24, letterSpacing: '0.05em', textTransform: 'uppercase' }}>₹49 Printing + ₹15 Shipping</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                        {standardFeatures.map((feat, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Check style={{ width: 12, height: 12, color: '#fff' }} />
                                </div>
                                <span style={{ fontSize: 14, color: '#334155', fontWeight: 500 }}>{feat}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase' }}>Select Finish</p>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button style={{ flex: 1, padding: '8px', border: '2px solid #2563EB', background: '#EFF6FF', color: '#2563EB', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>GLOSSY</button>
                            <button style={{ flex: 1, padding: '8px', border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>MATTE</button>
                        </div>
                    </div>

                    <button
                        onClick={onOrder}
                        style={{
                            width: '100%', padding: '16px', background: '#1D4ED8', color: '#fff',
                            border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                        }}
                    >
                        Get Standard Pack <ArrowRight style={{ width: 18, height: 18 }} />
                    </button>
                </div>

                {/* Professional Plan */}
                <div style={{ background: '#fff', borderRadius: 24, padding: 32, border: '2px solid #CA8A04', boxShadow: '0 10px 30px -5px rgba(202, 138, 4, 0.15)', position: 'relative' }}>
                    <div style={{
                        position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)',
                        background: '#CA8A04', color: '#fff', padding: '6px 16px', borderRadius: 999,
                        fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>Best Value Option</div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                        <div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>Professional Sheet</h3>
                            <span style={{ fontSize: 12, fontWeight: 600, background: '#FEF9C3', color: '#854D0E', padding: '4px 10px', borderRadius: 999 }}>Full A4 Sheet</span>
                        </div>
                        <div style={{ width: 32, height: 32, background: '#FEF9C3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Star style={{ color: '#CA8A04', width: 18, height: 18, fill: '#CA8A04' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 36, fontWeight: 800, color: '#0F172A' }}>₹99</span>
                        <span style={{ fontSize: 16, color: '#94A3B8', textDecoration: 'line-through' }}>₹199</span>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 24, letterSpacing: '0.05em', textTransform: 'uppercase' }}>₹84 Printing + ₹15 Shipping</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                        {professionalFeatures.map((feat, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#CA8A04', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Check style={{ width: 12, height: 12, color: '#fff' }} />
                                </div>
                                <span style={{ fontSize: 14, color: '#334155', fontWeight: feat.bold ? 700 : 500, fontStyle: feat.bold ? 'italic' : 'normal' }}>{feat.text}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase' }}>Select Finish</p>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button style={{ flex: 1, padding: '8px', border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>GLOSSY</button>
                            <button style={{ flex: 1, padding: '8px', border: '2px solid #CA8A04', background: '#FEF9C3', color: '#854D0E', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>MATTE</button>
                        </div>
                    </div>

                    <button
                        onClick={onOrder}
                        style={{
                            width: '100%', padding: '16px', background: '#0F172A', color: '#fff',
                            border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3)'
                        }}
                    >
                        Get Professional Pack <ArrowRight style={{ width: 18, height: 18 }} />
                    </button>
                </div>
            </div>

            {/* Compare Plans */}
            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', textAlign: 'center', marginBottom: 40 }}>Compare Plans</h2>

                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden' }}>

                    {/* Header Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(140px, 1fr) 1fr 1fr', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                        <div style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Features</div>
                        <div style={{ padding: '16px 24px', fontSize: 12, fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Standard (4x6)</div>
                        <div style={{ padding: '16px 24px', fontSize: 12, fontWeight: 800, color: '#CA8A04', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Professional (A4)</div>
                    </div>

                    {/* Rows */}
                    {[
                        { label: 'Sheet Dimensions', standard: '10.16 × 15.24 cm', prof: '21.0 x 29.7 cm' },
                        { label: 'Max Photo Capacity', standard: '12 Photos', prof: '42 Photos', boldProf: true },
                        { label: 'Paper Grade', standard: '220 GSM Premium', prof: '300 GSM Ultra-Premium' },
                        { label: 'Price per Photo', standard: '~₹5.33', prof: '~₹2.35', colorProf: '#16A34A' },
                        { label: 'Delivery Packaging', standard: 'Standard Envelope', prof: 'Rigid Stay-Flat Box' },
                        { label: 'Support Priority', standard: 'Regular', prof: 'Priority Support' }
                    ].map((row, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(140px, 1fr) 1fr 1fr', borderBottom: i === 5 ? 'none' : '1px solid #F1F5F9' }}>
                            <div style={{ padding: '20px 24px', fontSize: 14, fontWeight: 500, color: '#334155' }}>{row.label}</div>
                            <div style={{ padding: '20px 24px', fontSize: 14, color: '#475569' }}>{row.standard}</div>
                            <div style={{ padding: '20px 24px', fontSize: 14, fontWeight: row.boldProf ? 700 : 400, color: row.colorProf || '#0F172A' }}>{row.prof}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Icons */}
            <div style={{ maxWidth: 1000, margin: '80px auto 0', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, textAlign: 'center' }}>
                {[
                    { icon: Truck, title: 'Secure Delivery', desc: 'Insured & Trackable' },
                    { icon: ShieldCheck, title: 'Official Standards', desc: 'Guaranteed Acceptance' }, // Changed Shield to ShieldCheck
                    { icon: Zap, title: 'Lab Quality', desc: 'True-to-life Colors' },
                    { icon: ShieldCheck, title: 'Privacy First', desc: 'Auto-deleted in 24h' }
                ].map((item, i) => (
                    <div key={i}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#EFF6FF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                            <item.icon style={{ color: '#2563EB', width: 24, height: 24 }} />
                        </div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{item.title}</h3>
                        <p style={{ fontSize: 12, color: '#64748B' }}>{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* Footer styled bottom links */}
            <footer style={{ background: '#0F172A', marginTop: 80, padding: '40px 24px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Camera style={{ color: '#fff', width: 20, height: 20 }} />
                        <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>SelfieSePassport</span>
                    </div>
                    <div style={{ display: 'flex', gap: 24, fontSize: 13, color: '#94A3B8' }}>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Shipping Info</a>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
                    </div>
                </div>
                <div style={{ maxWidth: 1200, margin: '40px auto 0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, textAlign: 'center', fontSize: 12, color: '#64748B' }}>
                    ©2026 SelfieSePassport. Professional document photo services.
                </div>
            </footer>
        </div>
    );
};

export default Pricing;
