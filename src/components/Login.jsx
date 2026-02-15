import React, { useState } from 'react';
import { Camera, Mail, Lock, Eye, EyeOff, CheckCircle, ArrowLeft, Smartphone, KeyRound } from 'lucide-react';

const Login = ({ onBack, onSignup }) => {
    const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'mobile'
    const [showPassword, setShowPassword] = useState(false);

    // Mobile Auth State
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (mobileNumber.length < 10) return alert('Please enter a valid mobile number');

        // Simulate OTP sending
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
        if (otp.length !== 4) return alert('Please enter the 4-digit OTP');
        alert('Login Successful!');
        onBack(); // Go to home/dashboard
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            {/* Left Panel - Branding */}
            <div className="login-left" style={{
                flex: 1, background: '#1E40AF', color: '#fff',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: 40, position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ zIndex: 10, textAlign: 'center', maxWidth: 480 }}>
                    <div
                        onClick={onBack}
                        style={{
                            width: 80, height: 80, background: 'rgba(255,255,255,0.1)',
                            borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 32px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer'
                        }}>
                        <Camera style={{ width: 40, height: 40, color: '#fff' }} />
                    </div>

                    <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
                        Official Document Photos<br />Made Easy
                    </h1>

                    <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 48, lineHeight: 1.6 }}>
                        India's trusted passport, visa, and PAN card photo converter.
                        Professional results in seconds, compliant with official standards.
                    </p>

                    {/* Mockup / Visual */}
                    <div style={{
                        background: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 24,
                        backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)', marginBottom: 40
                    }}>
                        <div style={{
                            width: 200, height: 260, background: '#fff', borderRadius: 12,
                            margin: '0 auto', position: 'relative', overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{
                                position: 'absolute', inset: 0, background: '#f8fafc',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <div style={{ width: 120, height: 120, borderRadius: '50%', background: '#e2e8f0', border: '4px solid #fff' }}></div>
                            </div>

                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12,
                                background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
                                display: 'flex', alignItems: 'center', gap: 8
                            }}>
                                <CheckCircle style={{ width: 16, height: 16, color: '#22c55e' }} />
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>AI Compliance Check</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 48 }}>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 700 }}>1M+</div>
                            <div style={{ fontSize: 12, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Photos Created</div>
                        </div>
                        <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }}></div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 700 }}>4.9/5</div>
                            <div style={{ fontSize: 12, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Rating</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="login-right" style={{
                flex: 1, background: '#fff', padding: '40px 60px',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                maxWidth: 640
            }}>
                <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>

                    {/* Mobile/Form Header Branding */}
                    <div
                        onClick={onBack}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, cursor: 'pointer' }}
                    >
                        <div style={{ width: 28, height: 28, background: '#2563EB', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <Camera style={{ width: 16, height: 16 }} />
                        </div>
                        <span style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
                            SelfieSe<span style={{ color: '#2563EB' }}>Passport</span>
                        </span>
                    </div>

                    <button onClick={onBack} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'none', border: 'none', color: '#64748B',
                        fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 24
                    }}>
                        <ArrowLeft style={{ width: 16, height: 16 }} /> Back to Home
                    </button>

                    <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
                        {authMethod === 'email' ? 'Sign In' : 'Mobile Login'}
                    </h2>
                    <p style={{ color: '#64748B', marginBottom: 32 }}>
                        {authMethod === 'email'
                            ? 'Access your saved photos and orders.'
                            : 'Enter your number to receive an OTP.'}
                    </p>

                    {authMethod === 'email' ? (
                        /* EMAIL LOGIN FORM */
                        <form onSubmit={e => e.preventDefault()}>
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail style={{ position: 'absolute', left: 14, top: 12, width: 18, height: 18, color: '#94A3B8' }} />
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        style={{
                                            width: '100%', padding: '12px 12px 12px 42px', borderRadius: 10,
                                            border: '1px solid #E2E8F0', fontSize: 15, color: '#0F172A', outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#2563EB'}
                                        onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <label style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>Password</label>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Lock style={{ position: 'absolute', left: 14, top: 12, width: 18, height: 18, color: '#94A3B8' }} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        style={{
                                            width: '100%', padding: '12px 42px 12px 42px', borderRadius: 10,
                                            border: '1px solid #E2E8F0', fontSize: 15, color: '#0F172A', outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#2563EB'}
                                        onBlur={e => e.target.style.borderColor = '#E2E8F0'}
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
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                    <input type="checkbox" style={{ width: 16, height: 16, accentColor: '#2563EB', cursor: 'pointer' }} />
                                    <span style={{ fontSize: 14, color: '#475569' }}>Remember me</span>
                                </label>
                                <a href="#" style={{ fontSize: 14, fontWeight: 600, color: '#2563EB', textDecoration: 'none' }}>Forgot password?</a>
                            </div>

                            <button style={{
                                width: '100%', background: '#1E40AF', color: '#fff', border: 'none',
                                padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 600,
                                cursor: 'pointer', boxShadow: '0 4px 12px rgba(30,64,175,0.2)',
                                transition: 'background 0.2s'
                            }}>
                                Login to Account
                            </button>
                        </form>
                    ) : (
                        /* MOBILE LOGIN FORM */
                        <form onSubmit={showOtpInput ? handleVerifyOtp : handleSendOtp}>
                            {!showOtpInput ? (
                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Mobile Number</label>
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                        <div style={{
                                            position: 'absolute', left: 14, zIndex: 5,
                                            display: 'flex', alignItems: 'center', gap: 6,
                                            fontSize: 15, fontWeight: 600, color: '#334155', borderRight: '1px solid #E2E8F0', paddingRight: 8
                                        }}>
                                            <span>🇮🇳</span> +91
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="Enter 10 digit number"
                                            value={mobileNumber}
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setMobileNumber(val);
                                            }}
                                            style={{
                                                width: '100%', padding: '12px 12px 12px 90px', borderRadius: 10,
                                                border: '1px solid #E2E8F0', fontSize: 16, color: '#0F172A', outline: 'none',
                                                transition: 'border-color 0.2s', letterSpacing: '0.05em'
                                            }}
                                            onFocus={e => e.target.style.borderColor = '#2563EB'}
                                            onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div style={{ marginBottom: 24 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <label style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>Enter OTP</label>
                                        <button type="button" onClick={() => setShowOtpInput(false)} style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Change Number</button>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <KeyRound style={{ position: 'absolute', left: 14, top: 12, width: 18, height: 18, color: '#94A3B8' }} />
                                        <input
                                            type="text"
                                            placeholder="Enter 4-digit code"
                                            value={otp}
                                            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            style={{
                                                width: '100%', padding: '12px 12px 12px 42px', borderRadius: 10,
                                                border: '1px solid #E2E8F0', fontSize: 18, color: '#0F172A', outline: 'none',
                                                transition: 'border-color 0.2s', letterSpacing: '0.2em'
                                            }}
                                            onFocus={e => e.target.style.borderColor = '#2563EB'}
                                            onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                                        />
                                    </div>
                                    {otpTimer > 0 ? (
                                        <div style={{ marginTop: 8, fontSize: 12, color: '#64748B' }}>
                                            Resend OTP in <span style={{ fontWeight: 600, color: '#0F172A' }}>00:{otpTimer.toString().padStart(2, '0')}</span>
                                        </div>
                                    ) : (
                                        <button type="button" onClick={handleSendOtp} style={{ marginTop: 8, background: 'none', border: 'none', color: '#2563EB', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                            Resend OTP
                                        </button>
                                    )}
                                </div>
                            )}

                            <button style={{
                                width: '100%', background: '#1E40AF', color: '#fff', border: 'none',
                                padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 600,
                                cursor: 'pointer', boxShadow: '0 4px 12px rgba(30,64,175,0.2)',
                                transition: 'background 0.2s',
                                opacity: (!showOtpInput && mobileNumber.length < 10) || (showOtpInput && otp.length < 4) ? 0.7 : 1
                            }}>
                                {showOtpInput ? 'Verify & Login' : 'Get Verification Code'}
                            </button>
                        </form>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '32px 0' }}>
                        <div style={{ flex: 1, height: 1, background: '#E2E8F0' }}></div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Or continue with</span>
                        <div style={{ flex: 1, height: 1, background: '#E2E8F0' }}></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {authMethod === 'mobile' ? (
                            <button
                                onClick={() => {
                                    setAuthMethod('email');
                                    setShowOtpInput(false);
                                }}
                                style={{
                                    width: '100%', background: '#fff', border: '1px solid #E2E8F0',
                                    padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#1E293B',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    transition: 'background 0.2s'
                                }}
                            >
                                <Mail style={{ width: 18, height: 18, color: '#64748B' }} />
                                Login with Email
                            </button>
                        ) : (
                            <button
                                onClick={() => setAuthMethod('mobile')}
                                style={{
                                    width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0',
                                    padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#475569',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    transition: 'background 0.2s'
                                }}
                            >
                                <Smartphone style={{ width: 18, height: 18, color: '#64748B' }} />
                                Login with Mobile Number (OTP)
                            </button>
                        )}

                        <button style={{
                            width: '100%', background: '#fff', border: '1px solid #E2E8F0',
                            padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#1E293B',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            transition: 'background 0.2s'
                        }}>
                            <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: 18, height: 18 }} />
                            Google
                        </button>
                    </div>

                    <div style={{ marginTop: 40, textAlign: 'center', fontSize: 14, color: '#475569' }}>
                        Don't have an account? <button onClick={onSignup} style={{ fontWeight: 600, color: '#1E40AF', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Create an Account</button>
                    </div>

                    <div style={{ marginTop: 60, display: 'flex', justifyContent: 'center', gap: 24, fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
                        <span>•</span>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
                        <span>•</span>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Help Center</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
