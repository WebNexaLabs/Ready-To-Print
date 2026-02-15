import React, { useState } from 'react';
import { Camera, Mail, Lock, Eye, EyeOff, CheckCircle, ArrowLeft, Smartphone, KeyRound, User } from 'lucide-react';

const Signup = ({ onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);

    // Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [agreed, setAgreed] = useState(false);

    // Email OTP State
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (!fullName || !email || !mobile || !password) return alert('Please fill all fields');
        if (!agreed) return alert('Please agree to Terms and Privacy Policy');

        // Simulate OTP sending to Email
        setShowOtpInput(true);
        setOtpTimer(30);
        const timer = setInterval(() => {
            setOtpTimer((prev) => {
                if (prev <= 1) clearInterval(timer);
                return prev - 1;
            });
        }, 1000);
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (otp.length !== 4) return alert('Please enter the 4-digit OTP sent to your email');
        alert('Account Created Successfully!');
        onLogin(); // Go to login after success
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            {/* Left Panel - Branding (Blue) */}
            <div className="signup-left" style={{
                flex: 1, background: '#1E40AF', color: '#fff',
                display: 'flex', flexDirection: 'column', padding: '60px 80px',
                justifyContent: 'center'
            }}>
                <div style={{ marginBottom: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                        <div style={{ width: 48, height: 48, background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Camera style={{ width: 24, height: 24, color: '#1E40AF' }} />
                        </div>
                        <span style={{ fontSize: 24, fontWeight: 800 }}>SelfieSePassport</span>
                    </div>

                    <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
                        Unlock Professional Tools<br />for your ID Photos.
                    </h1>
                    <p style={{ fontSize: 18, opacity: 0.9, lineHeight: 1.6, maxWidth: 500 }}>
                        The smartest way to prepare official documents for Indian passports, visas, and PAN cards.
                    </p>
                </div>

                {/* Feature List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                                {[1, 2, 3, 4].map(i => <div key={i} style={{ width: 6, height: 6, background: '#fff', borderRadius: 1 }}></div>)}
                            </div>
                        </div>
                        <div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Save your layouts</h3>
                            <p style={{ fontSize: 14, opacity: 0.8, lineHeight: 1.5 }}>Organize and save your custom photo sheets for future printing needs.</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <div style={{ width: 2, height: 12, background: '#fff', borderRadius: 2 }}></div>
                            <div style={{ width: 12, height: 2, background: '#fff', borderRadius: 2, marginLeft: -7, marginTop: 10 }}></div>
                        </div>
                        <div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Unlimited downloads</h3>
                            <p style={{ fontSize: 14, opacity: 0.8, lineHeight: 1.5 }}>Download your photos in high-resolution, standard Indian sizes instantly.</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <div style={{ width: 20, height: 14, border: '2px solid #fff', borderRadius: 4, position: 'relative' }}>
                                <div style={{ position: 'absolute', top: -6, right: -6, width: 10, height: 10, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ width: 4, height: 3, borderLeft: '1.5px solid #1E40AF', borderBottom: '1.5px solid #1E40AF', transform: 'rotate(-45deg)', marginTop: -2 }}></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Cloud storage</h3>
                            <p style={{ fontSize: 14, opacity: 0.8, lineHeight: 1.5 }}>Securely store your biometric photos and access them from any device.</p>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: 60, borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: '#fff', border: '2px solid #1E40AF', marginLeft: i > 1 ? -10 : 0 }}></div>
                        ))}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>50,000+ Indians trust us for their document photos.</span>
                </div>
            </div>

            {/* Right Panel - Form (White) */}
            <div className="signup-right" style={{
                flex: 1, background: '#fff', padding: '60px 80px',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                maxWidth: 720
            }}>
                <div style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
                    <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>Create your Account</h2>
                    <p style={{ color: '#64748B', marginBottom: 40, lineHeight: 1.6 }}>
                        Join SelfieSePassport today and simplify your document processing.
                    </p>

                    <form onSubmit={showOtpInput ? handleVerifyOtp : handleSendOtp}>
                        {!showOtpInput ? (
                            <>
                                <div style={{ marginBottom: 20 }}>
                                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Full Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <User style={{ position: 'absolute', left: 14, top: 12, width: 18, height: 18, color: '#94A3B8' }} />
                                        <input
                                            type="text"
                                            placeholder="Rahul Sharma"
                                            value={fullName}
                                            onChange={e => setFullName(e.target.value)}
                                            style={{
                                                width: '100%', padding: '12px 12px 12px 42px', borderRadius: 8,
                                                border: '1px solid #E2E8F0', fontSize: 15, color: '#0F172A', outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: 20 }}>
                                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Email Address</label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail style={{ position: 'absolute', left: 14, top: 12, width: 18, height: 18, color: '#94A3B8' }} />
                                        <input
                                            type="email"
                                            placeholder="rahul.sharma@example.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            style={{
                                                width: '100%', padding: '12px 12px 12px 42px', borderRadius: 8,
                                                border: '1px solid #E2E8F0', fontSize: 15, color: '#0F172A', outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: 20 }}>
                                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Mobile Number</label>
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                        <div style={{
                                            position: 'absolute', left: 14, zIndex: 5,
                                            display: 'flex', alignItems: 'center', gap: 6,
                                            fontSize: 15, fontWeight: 600, color: '#64748B', borderRight: '1px solid #E2E8F0', paddingRight: 8
                                        }}>
                                            +91
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="98765 43210"
                                            value={mobile}
                                            onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            style={{
                                                width: '100%', padding: '12px 12px 12px 70px', borderRadius: 8,
                                                border: '1px solid #E2E8F0', fontSize: 15, color: '#0F172A', outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Create Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <Lock style={{ position: 'absolute', left: 14, top: 12, width: 18, height: 18, color: '#94A3B8' }} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            style={{
                                                width: '100%', padding: '12px 42px 12px 42px', borderRadius: 8,
                                                border: '1px solid #E2E8F0', fontSize: 15, color: '#0F172A', outline: 'none'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute', right: 14, top: 12, background: 'none', border: 'none',
                                                color: '#94A3B8', cursor: 'pointer', padding: 0
                                            }}
                                        >
                                            {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                                        </button>
                                    </div>
                                    <p style={{ fontSize: 11, color: '#64748B', marginTop: 6 }}>Minimum 8 characters with a mix of letters and numbers.</p>
                                </div>

                                <div style={{ display: 'flex', gap: 10, marginBottom: 32, alignItems: 'flex-start' }}>
                                    <input
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={e => setAgreed(e.target.checked)}
                                        style={{ marginTop: 4, width: 16, height: 16, accentColor: '#1E40AF', cursor: 'pointer' }}
                                    />
                                    <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>
                                        I agree to the <a href="#" style={{ color: '#1E40AF', fontWeight: 600, textDecoration: 'none' }}>Terms and Conditions</a> and <a href="#" style={{ color: '#1E40AF', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</a>.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <label style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>Enter Email OTP</label>
                                    <button type="button" onClick={() => setShowOtpInput(false)} style={{ background: 'none', border: 'none', color: '#1E40AF', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Change Details</button>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <KeyRound style={{ position: 'absolute', left: 14, top: 12, width: 18, height: 18, color: '#94A3B8' }} />
                                    <input
                                        type="text"
                                        placeholder="Enter 4-digit code"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                        style={{
                                            width: '100%', padding: '12px 12px 12px 42px', borderRadius: 8,
                                            border: '1px solid #E2E8F0', fontSize: 18, color: '#0F172A', outline: 'none',
                                            letterSpacing: '0.2em'
                                        }}
                                        autoFocus
                                    />
                                </div>
                                <p style={{ fontSize: 13, color: '#64748B', marginTop: 8 }}>
                                    We sent a verification code to <span style={{ fontWeight: 600, color: '#0F172A' }}>{email}</span>
                                </p>
                            </div>
                        )}

                        <button style={{
                            width: '100%', background: '#1E40AF', color: '#fff', border: 'none',
                            padding: '14px', borderRadius: 8, fontSize: 15, fontWeight: 600,
                            cursor: 'pointer', boxShadow: '0 4px 12px rgba(30,64,175,0.2)',
                            transition: 'background 0.2s',
                            opacity: (!showOtpInput && !agreed) ? 0.7 : 1
                        }}>
                            {showOtpInput ? 'Verify Email via OTP' : 'Verify Email via OTP'}
                        </button>
                    </form>

                    <div style={{ marginTop: 32, textAlign: 'center', fontSize: 14, color: '#475569' }}>
                        Already have an account? <button onClick={onLogin} style={{ background: 'none', border: 'none', fontWeight: 600, color: '#1E40AF', cursor: 'pointer', padding: 0 }}>Login</button>
                    </div>

                    <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center', gap: 20, fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 12, height: 12, background: '#64748B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 8 }}>L</div>
                            SECURE ENCRYPTION
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle style={{ width: 12, height: 12 }} />
                            ISO CERTIFIED
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
