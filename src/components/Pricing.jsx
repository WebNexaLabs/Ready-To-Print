import React, { useState, useEffect } from 'react';
import { Check, X, ShieldCheck, Truck, Zap, Info, ArrowRight, Printer, Star, Camera, Clock, Cloud, Download, Layout, Wand2, History, MousePointerClick } from 'lucide-react';

const Pricing = ({ onOrder, onNavigate, onSupport, onUpgrade }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

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

    const unlimitedFeatures = [
        { icon: Download, text: 'Unlimited High-Res Digital Downloads' },
        { icon: Layout, text: 'Unlimited Print-Ready Layouts' },
        { icon: Wand2, text: 'Priority AI Background Removal' },
        { icon: History, text: 'Cloud Storage for all IDs' },
        { icon: MousePointerClick, text: 'No Ads & No Watermarks' }
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
                <div style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column' }}>
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



                    <button
                        onClick={onOrder}
                        style={{
                            marginTop: 'auto', width: '100%', padding: '16px', background: '#1D4ED8', color: '#fff',
                            border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                        }}
                    >
                        Get Standard Pack <ArrowRight style={{ width: 18, height: 18 }} />
                    </button>
                </div>

                {/* Professional Plan */}
                <div style={{ background: '#fff', borderRadius: 24, padding: 32, border: '2px solid #CA8A04', boxShadow: '0 10px 30px -5px rgba(202, 138, 4, 0.15)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)',
                        background: '#CA8A04', color: '#fff', padding: '6px 16px', borderRadius: 999,
                        fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        whiteSpace: 'nowrap'
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




                    <button
                        onClick={onOrder}
                        style={{
                            marginTop: 'auto', width: '100%', padding: '16px', background: '#0F172A', color: '#fff',
                            border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3)'
                        }}
                    >
                        Get Professional Pack <ArrowRight style={{ width: 18, height: 18 }} />
                    </button>
                </div>

                {/* Unlimited Digital Plan */}
                <div style={{ background: '#fff', borderRadius: 24, padding: 32, border: '2px solid #7C3AED', boxShadow: '0 10px 30px -5px rgba(124, 58, 237, 0.15)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', color: '#fff', padding: '6px 16px', borderRadius: 999,
                        fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        whiteSpace: 'nowrap'
                    }}>Limited Time Offer</div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                        <div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>Unlimited Digital Print</h3>
                            <span style={{ fontSize: 12, fontWeight: 600, background: '#F3E8FF', color: '#7C3AED', padding: '4px 10px', borderRadius: 999 }}>Subscription Model</span>
                        </div>
                        <div style={{ width: 32, height: 32, background: '#F3E8FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Cloud style={{ color: '#7C3AED', width: 18, height: 18, fill: '#7C3AED' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 36, fontWeight: 800, color: '#0F172A' }}>₹199</span>
                        <span style={{ fontSize: 16, color: '#94A3B8', textDecoration: 'line-through' }}>₹499</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
                        <Clock style={{ width: 14, height: 14, color: '#7C3AED' }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Valid for 3 Months</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                        {unlimitedFeatures.map((feat, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <feat.icon style={{ width: 12, height: 12, color: '#7C3AED' }} />
                                </div>
                                <span style={{ fontSize: 14, color: '#334155', fontWeight: 500 }}>{feat.text}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={onUpgrade}
                        style={{
                            marginTop: 'auto', width: '100%', padding: '16px', background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', color: '#fff',
                            border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                        }}
                    >
                        Unlock Subscription <Zap style={{ width: 18, height: 18, fill: 'currentColor' }} />
                    </button>
                </div>
            </div>

            {/* Compare Plans */}
            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', textAlign: 'center', marginBottom: 40 }}>Compare Plans</h2>

                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden' }}>

                    {/* Header Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(140px, 1fr) 1fr 1fr 1fr', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                        <div style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Features</div>
                        <div style={{ padding: '16px 24px', fontSize: 12, fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Standard (4x6)</div>
                        <div style={{ padding: '16px 24px', fontSize: 12, fontWeight: 800, color: '#CA8A04', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Professional (A4)</div>
                        <div style={{ padding: '16px 24px', fontSize: 12, fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unlimited Digital</div>
                    </div>

                    {/* Rows */}
                    {[
                        { label: 'Sheet Format', standard: '4x6" Physical', prof: 'A4 Physical', unlim: 'Digital (Print Ready)', colorUnlim: '#475569' },
                        { label: 'Max Photo Capacity', standard: '12 Photos', prof: '42 Photos', boldProf: true, unlim: 'Unlimited', colorUnlim: '#7C3AED', boldUnlim: true },
                        { label: 'Validity', standard: 'One-time', prof: 'One-time', unlim: '3 Months', boldUnlim: true },
                        { label: 'Delivery Method', standard: '3-5 Days', prof: 'Express Delivery', colorProf: '#16A34A', unlim: 'Instant Access', colorUnlim: '#7C3AED', boldUnlim: true },
                        { label: 'Support Priority', standard: 'Regular', prof: 'Priority Support', unlim: 'VIP Priority', boldUnlim: true }
                    ].map((row, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(140px, 1fr) 1fr 1fr 1fr', borderBottom: i === 4 ? 'none' : '1px solid #F1F5F9' }}>
                            <div style={{ padding: '20px 24px', fontSize: 14, fontWeight: 500, color: '#334155' }}>{row.label}</div>
                            <div style={{ padding: '20px 24px', fontSize: 14, color: '#475569' }}>{row.standard}</div>
                            <div style={{ padding: '20px 24px', fontSize: 14, fontWeight: row.boldProf ? 700 : 400, color: row.colorProf || '#0F172A' }}>{row.prof}</div>
                            <div style={{ padding: '20px 24px', fontSize: 14, fontWeight: row.boldUnlim ? 700 : 400, color: row.colorUnlim || '#0F172A' }}>{row.unlim}</div>
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
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>Privacy Policy</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>Terms of Service</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('guidelines'); }} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>Photo Guidelines</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); onSupport(); }} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>Contact Support</a>
                    </div>
                </div>
                <div style={{ maxWidth: 1200, margin: '40px auto 0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, textAlign: 'center', fontSize: 12, color: '#64748B' }}>
                    ©2026 SelfieSePassport. Professional document photo services.
                </div>
            </footer>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    title="Scroll to Top"
                    style={{
                        position: 'fixed',
                        bottom: 40,
                        right: 40,
                        backgroundColor: '#2563EB',
                        color: '#fff',
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                        transition: 'all 0.3s ease',
                        zIndex: 100
                    }}
                >
                    <ArrowRight style={{ width: 24, height: 24, transform: 'rotate(-90deg)' }} />
                </button>
            )}
        </div>
    );
};

export default Pricing;
