
import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle, Smartphone, Mail, Lock, BadgeCheck, Zap, X, Clock, CreditCard, Building2, User } from 'lucide-react';

const GlobalModals = ({
    showPrivacy, setShowPrivacy,
    showRefund, setShowRefund,
    showSupport, setShowSupport,
    showSubscription, setShowSubscription
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
                        background: '#fff', borderRadius: 24, padding: 40, maxWidth: 600, width: '100%',
                        position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', overflowY: 'auto'
                    }} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setShowPrivacy(false)}
                            style={{
                                position: 'absolute', top: 24, right: 24, background: '#F1F5F9', border: 'none',
                                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: '#64748B'
                            }}
                        >
                            <ArrowRight style={{ width: 18, height: 18, transform: 'rotate(45deg)' }} />
                        </button>

                        <div style={{ width: 48, height: 48, background: '#EFF6FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: '#2563EB' }}>
                            <ShieldCheck style={{ width: 24, height: 24 }} />
                        </div>

                        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Data Protection</h2>
                        <p style={{ fontSize: 16, fontWeight: 600, color: '#334155', marginBottom: 24 }}>Your privacy is our priority.</p>

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
                                    <span style={{ fontSize: 15, color: '#475569', lineHeight: 1.5 }}>{text}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowPrivacy(false)}
                            style={{
                                marginTop: 32, width: '100%', background: '#0F172A', color: '#fff', border: 'none',
                                padding: '16px', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Refund Policy Modal */}
            {showRefund && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 100,
                    background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
                }} onClick={() => setShowRefund(false)}>
                    <div style={{
                        background: '#fff', borderRadius: 24, padding: 40, maxWidth: 600, width: '100%',
                        position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', overflowY: 'auto'
                    }} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setShowRefund(false)}
                            style={{
                                position: 'absolute', top: 24, right: 24, background: '#F1F5F9', border: 'none',
                                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: '#64748B'
                            }}
                        >
                            <ArrowRight style={{ width: 18, height: 18, transform: 'rotate(45deg)' }} />
                        </button>

                        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>Refund Policy</h2>
                        <p style={{ fontSize: 15, color: '#64748B', marginBottom: 24 }}>At SelfieSePassport, customer satisfaction is our priority.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                            {/* Eligibility */}
                            <div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span>✅</span> Eligibility for Refund
                                </h3>
                                <p style={{ fontSize: 14, color: '#334155', marginBottom: 8 }}>You are eligible for a full refund if:</p>
                                <ul style={{ paddingLeft: 20, fontSize: 14, color: '#475569', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <li>Your generated passport photo is rejected due to non-compliance with official size or background standards.</li>
                                    <li>There is a technical error in processing your photo.</li>
                                </ul>
                            </div>

                            {/* Non-Refundable */}
                            <div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span>❌</span> Non-Refundable Cases
                                </h3>
                                <p style={{ fontSize: 14, color: '#334155', marginBottom: 8 }}>Refunds will not be issued if:</p>
                                <ul style={{ paddingLeft: 20, fontSize: 14, color: '#475569', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <li>The uploaded photo does not follow the provided Photo Guidelines.</li>
                                    <li>The rejection is due to incorrect user-uploaded image (blur, wrong lighting, wrong pose, etc.).</li>
                                    <li>The final photo was downloaded successfully and meets standard specifications.</li>
                                </ul>
                            </div>

                            {/* Process */}
                            <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 12 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span>📌</span> Refund Process
                                </h3>
                                <ul style={{ paddingLeft: 20, fontSize: 14, color: '#475569', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <li>Contact our support team within 48 hours of rejection.</li>
                                    <li>Provide proof of rejection (receipt or written reason).</li>
                                    <li>Refunds will be processed within 5–7 working days after verification.</li>
                                </ul>
                            </div>

                        </div>

                        <button
                            onClick={() => setShowRefund(false)}
                            style={{
                                marginTop: 32, width: '100%', background: '#0F172A', color: '#fff', border: 'none',
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
                        background: '#fff', borderRadius: 24, padding: 40, maxWidth: 500, width: '100%',
                        position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        textAlign: 'center'
                    }} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setShowSupport(false)}
                            style={{
                                position: 'absolute', top: 24, right: 24, background: '#F1F5F9', border: 'none',
                                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: '#64748B'
                            }}
                        >
                            <ArrowRight style={{ width: 18, height: 18, transform: 'rotate(45deg)' }} />
                        </button>

                        <div style={{ width: 64, height: 64, background: '#EFF6FF', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#2563EB' }}>
                            <div style={{ fontSize: 32 }}>👋</div>
                        </div>

                        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>Need help?</h2>
                        <p style={{ fontSize: 16, color: '#64748B', marginBottom: 32 }}>We're here for you.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ fontSize: 24 }}>📱</div>
                                <div style={{ textAlign: 'left' }}>
                                    <p style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>Contact No</p>
                                    <p style={{ fontSize: 16, color: '#0F172A', fontWeight: 700 }}>+91 8617371378</p>
                                </div>
                            </div>

                            <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ fontSize: 24 }}>📧</div>
                                <div style={{ textAlign: 'left' }}>
                                    <p style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>Email</p>
                                    <p style={{ fontSize: 16, color: '#0F172A', fontWeight: 700 }}>anupmondal345@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowSupport(false)}
                            style={{
                                marginTop: 32, width: '100%', background: '#0F172A', color: '#fff', border: 'none',
                                padding: '16px', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {/* Subscription Modal */}
            {showSubscription && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 100,
                    background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
                }} onClick={() => setShowSubscription(false)}>
                    <div style={{
                        background: '#fff', borderRadius: 24, padding: 0, maxWidth: 1000, width: '100%',
                        position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'row'
                    }} onClick={e => e.stopPropagation()} className="subscription-modal-content">

                        <button
                            onClick={() => setShowSubscription(false)}
                            style={{
                                position: 'absolute', top: 20, right: 20,
                                background: 'rgba(0,0,0,0.05)', border: 'none',
                                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: '#64748B', zIndex: 20
                            }}
                        >
                            <X style={{ width: 18, height: 18 }} />
                        </button>

                        {/* Left Side - Plan Details */}
                        <div style={{ width: '40%', background: '#EFF6FF', padding: 40, display: 'flex', flexDirection: 'column', position: 'relative' }} className="modal-left-col">
                            <div style={{
                                background: '#DBEAFE', color: '#2563EB', fontSize: 11, fontWeight: 800,
                                padding: '6px 12px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.05em',
                                alignSelf: 'flex-start', marginBottom: 16
                            }}>
                                Selected Plan
                            </div>

                            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginBottom: 8, lineHeight: 1.2 }}>
                                Unlimited Digital Print
                            </h2>
                            <p style={{ fontSize: 14, color: '#64748B', marginBottom: 24 }}>Valid for 3 Months (90 Days)</p>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 32 }}>
                                <span style={{ fontSize: 40, fontWeight: 800, color: '#2563EB' }}>₹199</span>
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8' }}>Incl. of GST</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
                                {[
                                    { title: 'Unlimited High-Res Downloads', desc: 'Download as many photos as you need without any watermarks.' },
                                    { title: '42-Photo Layout Generation', desc: 'Automatically tiled 4x6, A4 layouts ready for professional printing.' },
                                    { title: 'AI Background Removal', desc: 'Precise Indian Passport compliant white background auto-removal.' },
                                    { title: 'Multiple Sizes Supported', desc: 'Passport (3.5×4.5cm) and Custom formats.' }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 12 }}>
                                        <div style={{ marginTop: 2 }}>
                                            <CheckCircle style={{ width: 20, height: 20, color: '#22C55E', fill: '#DCFCE7' }} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>{item.title}</h4>
                                            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>


                        </div>

                        {/* Right Side - Payment Form */}
                        <div style={{ width: '60%', padding: 40, background: '#fff' }} className="modal-right-col">
                            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#2563EB', color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                                Contact Information
                            </h3>

                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Full Name</label>
                                <input type="text" placeholder="Enter your full name" style={{
                                    width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 14, color: '#0F172A', outline: 'none'
                                }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 8 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Mobile Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontSize: 14, fontWeight: 500 }}>+91</span>
                                        <input type="tel" placeholder="98765 43210" style={{
                                            width: '100%', padding: '12px 12px 12px 48px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 14, color: '#0F172A', outline: 'none'
                                        }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Email Address</label>
                                    <input type="email" placeholder="name@example.com" style={{
                                        width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 14, color: '#0F172A', outline: 'none'
                                    }} />
                                </div>
                            </div>
                            <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 32 }}>We'll send the payment receipt to this number.</p>

                            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#2563EB', color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                                Choose Payment Method
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                                {/* UPI Option */}
                                <div style={{ border: '2px solid #2563EB', borderRadius: 12, padding: 16, background: '#EFF6FF', cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            <div style={{ width: 40, height: 40, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', fontSize: 18 }}>⚡</div>
                                            <div>
                                                <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>UPI (Recommended)</p>
                                                <p style={{ fontSize: 11, color: '#64748B' }}>GPay, PhonePe, Paytm, or any BHIM UPI</p>
                                            </div>
                                        </div>
                                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: '6px solid #2563EB', background: '#fff' }}></div>
                                    </div>

                                    <div style={{ background: '#fff', padding: 16, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                                        <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 8 }}>OR ENTER UPI ID</label>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <input type="text" placeholder="username@upi" style={{ flex: 1, padding: '10px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none' }} />
                                            <button style={{ background: '#1D4ED8', color: '#fff', border: 'none', padding: '0 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Verify</button>
                                        </div>
                                    </div>
                                </div>


                            </div>

                            <button
                                style={{
                                    width: '100%', padding: '16px', background: '#1D4ED8', color: '#fff',
                                    border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700,
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)', marginBottom: 24
                                }}
                            >
                                <Lock style={{ width: 18, height: 18 }} /> Securely Pay ₹199
                            </button>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, opacity: 0.6 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 600, color: '#64748B' }}>
                                    <ShieldCheck style={{ width: 14, height: 14 }} /> 100% SECURE TRANSACTION
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 600, color: '#64748B' }}>
                                    <BadgeCheck style={{ width: 14, height: 14 }} /> PCI-DSS COMPLIANT
                                </div>
                            </div>
                        </div>

                        <style>{`
                            .subscription-modal-content::-webkit-scrollbar {
                                width: 8px;
                            }
                            .subscription-modal-content::-webkit-scrollbar-track {
                                background: transparent;
                            }
                            .subscription-modal-content::-webkit-scrollbar-thumb {
                                background-color: #CBD5E1;
                                border-radius: 20px;
                                border: 3px solid transparent;
                                background-clip: content-box;
                            }
                            .subscription-modal-content::-webkit-scrollbar-thumb:hover {
                                background-color: #94A3B8;
                            }
                            @media (max-width: 900px) {
                                .subscription-modal-content {
                                    flex-direction: column !important;
                                    max-height: 90vh !important;
                                    width: 90% !important;
                                }
                                .modal-left-col {
                                    width: 100% !important;
                                    padding: 24px !important;
                                }
                                .modal-right-col {
                                    width: 100% !important;
                                    padding: 24px !important;
                                }
                            }
                        `}</style>
                    </div>
                </div>
            )}
        </>
    );
};

export default GlobalModals;
