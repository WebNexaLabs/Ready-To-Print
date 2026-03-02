import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Mail, Lock, Eye, EyeOff, ArrowLeft, Smartphone, KeyRound } from 'lucide-react';

const Login = ({ onBack, onSignup }) => {
    const [authMethod, setAuthMethod] = useState('email');
    const [showPassword, setShowPassword] = useState(false);
    const [activeField, setActiveField] = useState(null); // 'email' | 'password' | null

    // Mobile Auth State
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);

    // Mouse tracking
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const leftPanelRef = useRef(null);

    const handleMouseMove = useCallback((e) => {
        if (leftPanelRef.current) {
            const rect = leftPanelRef.current.getBoundingClientRect();
            setMousePos({
                x: ((e.clientX - rect.left) / rect.width) * 2 - 1,  // -1 to 1
                y: ((e.clientY - rect.top) / rect.height) * 2 - 1   // -1 to 1
            });
        }
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (mobileNumber.length < 10) return alert('Please enter a valid mobile number');
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
        onBack();
    };

    // Calculate pupil position based on mouse or active field
    const getPupilStyle = (charIndex) => {
        if (activeField === 'password') {
            return { opacity: 0, transform: 'translate(0, 0) scale(0)' };
        }

        let tx, ty;
        if (activeField === 'email') {
            // Look toward the right (form side)
            tx = 3;
            ty = 1;
        } else {
            // Follow mouse with a max offset of 4px
            tx = mousePos.x * 4;
            ty = mousePos.y * 4;
        }

        return {
            opacity: 1,
            transform: `translate(${tx}px, ${ty}px) scale(1)`,
            transition: 'all 0.15s ease-out'
        };
    };

    // Characters configuration
    const characters = [
        { id: 0, color: '#7C3AED', width: 70, height: 140, radius: 28, bottom: 0, left: 30 },
        { id: 1, color: 'var(--text-secondary)', width: 80, height: 90, radius: 16, bottom: 0, left: 115 },
        { id: 2, color: '#F97316', width: 65, height: 100, radius: 50, bottom: 0, left: 210 },
        { id: 3, color: '#FACC15', width: 55, height: 55, radius: 50, bottom: 0, left: 290 },
    ];

    const renderCharacter = (char) => {
        const isCovering = activeField === 'password';

        return (
            <div key={char.id} style={{
                position: 'absolute',
                bottom: char.bottom,
                left: char.left,
                width: char.width,
                height: char.height,
                background: char.color,
                borderRadius: char.radius,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0,
                transition: 'transform 0.3s ease',
                animation: `charBounce${char.id} 3s ease-in-out infinite`,
                boxShadow: `0 8px 24px ${char.color}40`,
            }}>
                {/* Eyes container */}
                <div style={{
                    display: 'flex',
                    gap: char.width > 60 ? 10 : 6,
                    marginTop: char.height > 100 ? -10 : 0,
                    position: 'relative',
                }}>
                    {/* Left Eye */}
                    <div style={{
                        width: char.width > 60 ? 20 : 16,
                        height: char.width > 60 ? 20 : 16,
                        background: 'var(--bg-primary)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative',
                    }}>
                        {isCovering ? (
                            <div style={{
                                width: '70%', height: 3,
                                background: char.color === '#1E293B' ? '#fff' : '#333',
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                            }} />
                        ) : (
                            <div style={{
                                width: 8, height: 8,
                                background: '#1E293B',
                                borderRadius: '50%',
                                ...getPupilStyle(char.id),
                            }} />
                        )}
                    </div>

                    {/* Right Eye */}
                    <div style={{
                        width: char.width > 60 ? 20 : 16,
                        height: char.width > 60 ? 20 : 16,
                        background: 'var(--bg-primary)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative',
                    }}>
                        {isCovering ? (
                            <div style={{
                                width: '70%', height: 3,
                                background: char.color === '#1E293B' ? '#fff' : '#333',
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                            }} />
                        ) : (
                            <div style={{
                                width: 8, height: 8,
                                background: '#1E293B',
                                borderRadius: '50%',
                                ...getPupilStyle(char.id),
                            }} />
                        )}
                    </div>
                </div>

                {/* Covering hands for password mode */}
                {isCovering && char.height > 80 && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -60%)',
                        display: 'flex',
                        gap: 4,
                        animation: 'handsUp 0.4s ease forwards',
                    }}>
                        <div style={{
                            width: char.width * 0.3,
                            height: char.width * 0.25,
                            background: char.color,
                            borderRadius: '50%',
                            border: `2px solid rgba(255,255,255,0.3)`,
                            filter: 'brightness(1.15)',
                        }} />
                        <div style={{
                            width: char.width * 0.3,
                            height: char.width * 0.25,
                            background: char.color,
                            borderRadius: '50%',
                            border: `2px solid rgba(255,255,255,0.3)`,
                            filter: 'brightness(1.15)',
                        }} />
                    </div>
                )}

                {/* Little smile */}
                <div style={{
                    width: char.width > 60 ? 14 : 10,
                    height: char.width > 60 ? 7 : 5,
                    borderBottom: `2px solid rgba(255,255,255,0.5)`,
                    borderRadius: '0 0 50% 50%',
                    marginTop: 4,
                    transition: 'all 0.3s ease',
                    opacity: isCovering ? 0 : 1,
                }} />
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            {/* Left Panel - Characters */}
            <div
                ref={leftPanelRef}
                className="login-left"
                style={{
                    flex: 1, background: 'linear-gradient(160deg, #1E40AF 0%, #3B82F6 50%, #6366F1 100%)',
                    color: '#fff',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: 40, position: 'relative', overflow: 'hidden',
                    cursor: 'default',
                }}
            >
                {/* Decorative floating circles */}
                <div style={{ position: 'absolute', top: 60, left: 40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', animation: 'float 6s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', top: 200, right: 60, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', animation: 'float 8s ease-in-out infinite reverse' }} />
                <div style={{ position: 'absolute', bottom: 120, left: 80, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', animation: 'float 5s ease-in-out infinite' }} />

                {/* Branding */}
                <div style={{ zIndex: 10, textAlign: 'center', maxWidth: 480, marginBottom: 60 }}>
                    <div
                        onClick={onBack}
                        style={{
                            width: 64, height: 64, background: 'rgba(255,255,255,0.15)',
                            borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer', transition: 'transform 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Camera style={{ width: 32, height: 32, color: '#fff' }} />
                    </div>

                    <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, lineHeight: 1.3 }}>
                        Official Document Photos<br />Made Easy
                    </h1>

                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                        India's trusted passport & document photo converter
                    </p>
                </div>

                {/* Characters Scene */}
                <div style={{
                    position: 'relative',
                    width: 370, height: 160,
                    zIndex: 10,
                }}>
                    {/* Ground shadow */}
                    <div style={{
                        position: 'absolute',
                        bottom: -8,
                        left: 20,
                        right: 20,
                        height: 16,
                        background: 'radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, transparent 70%)',
                        borderRadius: '50%',
                    }} />
                    {characters.map(renderCharacter)}
                </div>

                {/* Hint text */}
                <p style={{
                    marginTop: 32,
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.4)',
                    fontWeight: 500,
                    zIndex: 10,
                    letterSpacing: '0.03em',
                }}>
                    👆 Move your mouse around — we're watching!
                </p>
            </div>

            {/* Right Panel - Form */}
            <div className="login-right" style={{
                flex: 1, background: 'var(--bg-primary)', padding: '40px 60px',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                maxWidth: 640
            }}>
                <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>

                    {/* Logo */}
                    <div
                        onClick={onBack}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, cursor: 'pointer' }}
                    >
                        <div style={{ width: 28, height: 28, background: '#2563EB', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <Camera style={{ width: 16, height: 16 }} />
                        </div>
                        <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
                            SelfieSe<span style={{ color: '#2563EB' }}>Passport</span>
                        </span>
                    </div>

                    <button onClick={onBack} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'none', border: 'none', color: 'var(--text-muted-dark)',
                        fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 24
                    }}>
                        <ArrowLeft style={{ width: 16, height: 16 }} /> Back to Home
                    </button>

                    <h2 style={{
                        fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8,
                        animation: 'fadeInUp 0.5s ease forwards',
                    }}>
                        {authMethod === 'email' ? 'Welcome back!' : 'Mobile Login'}
                    </h2>
                    <p style={{
                        color: 'var(--text-muted-dark)', marginBottom: 32,
                        animation: 'fadeInUp 0.5s 0.1s ease forwards',
                        opacity: 0, animationFillMode: 'forwards',
                    }}>
                        {authMethod === 'email'
                            ? 'Access your saved photos and orders.'
                            : 'Enter your number to receive an OTP.'}
                    </p>

                    {authMethod === 'email' ? (
                        <form onSubmit={e => e.preventDefault()}>
                            <div style={{ marginBottom: 20, animation: 'fadeInUp 0.5s 0.15s ease forwards', opacity: 0, animationFillMode: 'forwards' }}>
                                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 8 }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail style={{ position: 'absolute', left: 14, top: 12, width: 18, height: 18, color: 'var(--text-disabled)' }} />
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        style={{
                                            width: '100%', padding: '12px 12px 12px 42px', borderRadius: 10,
                                            border: '2px solid var(--border-light)', fontSize: 15, color: 'var(--text-primary)', outline: 'none',
                                            transition: 'border-color 0.2s, box-shadow 0.2s'
                                        }}
                                        onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.1)'; setActiveField('email'); }}
                                        onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; setActiveField(null); }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: 24, animation: 'fadeInUp 0.5s 0.2s ease forwards', opacity: 0, animationFillMode: 'forwards' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-tertiary)' }}>Password</label>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Lock style={{ position: 'absolute', left: 14, top: 12, width: 18, height: 18, color: 'var(--text-disabled)' }} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        style={{
                                            width: '100%', padding: '12px 42px 12px 42px', borderRadius: 10,
                                            border: '2px solid var(--border-light)', fontSize: 15, color: 'var(--text-primary)', outline: 'none',
                                            transition: 'border-color 0.2s, box-shadow 0.2s'
                                        }}
                                        onFocus={e => { e.target.style.borderColor = '#7C3AED'; e.target.style.boxShadow = '0 0 0 4px rgba(124,58,237,0.1)'; setActiveField('password'); }}
                                        onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; setActiveField(null); }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute', right: 14, top: 12, background: 'none', border: 'none',
                                            color: 'var(--text-disabled)', cursor: 'pointer', padding: 0
                                        }}
                                    >
                                        {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, animation: 'fadeInUp 0.5s 0.25s ease forwards', opacity: 0, animationFillMode: 'forwards' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                    <input type="checkbox" style={{ width: 16, height: 16, accentColor: '#2563EB', cursor: 'pointer' }} />
                                    <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Remember me</span>
                                </label>
                                <a href="#" style={{ fontSize: 14, fontWeight: 600, color: '#2563EB', textDecoration: 'none' }}>Forgot password?</a>
                            </div>

                            <button style={{
                                width: '100%', background: 'linear-gradient(135deg, #1E40AF, #2563EB)', color: '#fff', border: 'none',
                                padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 600,
                                cursor: 'pointer', boxShadow: '0 4px 16px rgba(30,64,175,0.3)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                animation: 'fadeInUp 0.5s 0.3s ease forwards', opacity: 0, animationFillMode: 'forwards'
                            }}
                                onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 20px rgba(30,64,175,0.4)'; }}
                                onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 16px rgba(30,64,175,0.3)'; }}
                            >
                                Log In
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={showOtpInput ? handleVerifyOtp : handleSendOtp}>
                            {!showOtpInput ? (
                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 8 }}>Mobile Number</label>
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                        <div style={{
                                            position: 'absolute', left: 14, zIndex: 5,
                                            display: 'flex', alignItems: 'center', gap: 6,
                                            fontSize: 15, fontWeight: 600, color: 'var(--text-tertiary)', borderRight: '1px solid var(--border-light)', paddingRight: 8
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
                                                border: '2px solid var(--border-light)', fontSize: 16, color: 'var(--text-primary)', outline: 'none',
                                                transition: 'border-color 0.2s', letterSpacing: '0.05em'
                                            }}
                                            onFocus={e => { e.target.style.borderColor = '#2563EB'; setActiveField('email'); }}
                                            onBlur={e => { e.target.style.borderColor = '#E2E8F0'; setActiveField(null); }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div style={{ marginBottom: 24 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-tertiary)' }}>Enter OTP</label>
                                        <button type="button" onClick={() => setShowOtpInput(false)} style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Change Number</button>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <KeyRound style={{ position: 'absolute', left: 14, top: 12, width: 18, height: 18, color: 'var(--text-disabled)' }} />
                                        <input
                                            type="text"
                                            placeholder="Enter 4-digit code"
                                            value={otp}
                                            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            style={{
                                                width: '100%', padding: '12px 12px 12px 42px', borderRadius: 10,
                                                border: '2px solid var(--border-light)', fontSize: 18, color: 'var(--text-primary)', outline: 'none',
                                                transition: 'border-color 0.2s', letterSpacing: '0.2em'
                                            }}
                                            onFocus={e => { e.target.style.borderColor = '#2563EB'; setActiveField('password'); }}
                                            onBlur={e => { e.target.style.borderColor = '#E2E8F0'; setActiveField(null); }}
                                        />
                                    </div>
                                    {otpTimer > 0 ? (
                                        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted-dark)' }}>
                                            Resend OTP in <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>00:{otpTimer.toString().padStart(2, '0')}</span>
                                        </div>
                                    ) : (
                                        <button type="button" onClick={handleSendOtp} style={{ marginTop: 8, background: 'none', border: 'none', color: '#2563EB', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                            Resend OTP
                                        </button>
                                    )}
                                </div>
                            )}

                            <button style={{
                                width: '100%', background: 'linear-gradient(135deg, #1E40AF, #2563EB)', color: '#fff', border: 'none',
                                padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 600,
                                cursor: 'pointer', boxShadow: '0 4px 16px rgba(30,64,175,0.3)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                opacity: (!showOtpInput && mobileNumber.length < 10) || (showOtpInput && otp.length < 4) ? 0.7 : 1
                            }}>
                                {showOtpInput ? 'Verify & Login' : 'Get Verification Code'}
                            </button>
                        </form>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '32px 0' }}>
                        <div style={{ flex: 1, height: 1, background: '#27273A' }}></div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-disabled)', textTransform: 'uppercase' }}>Or continue with</span>
                        <div style={{ flex: 1, height: 1, background: '#27273A' }}></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {authMethod === 'mobile' ? (
                            <button
                                onClick={() => { setAuthMethod('email'); setShowOtpInput(false); }}
                                style={{
                                    width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)',
                                    padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                            >
                                <Mail style={{ width: 18, height: 18, color: 'var(--text-muted-dark)' }} />
                                Login with Email
                            </button>
                        ) : (
                            <button
                                onClick={() => setAuthMethod('mobile')}
                                style={{
                                    width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
                                    padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: 'var(--text-muted)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#EFF6FF'}
                                onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
                            >
                                <Smartphone style={{ width: 18, height: 18, color: 'var(--text-muted-dark)' }} />
                                Login with Mobile Number (OTP)
                            </button>
                        )}

                        <button style={{
                            width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)',
                            padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            transition: 'all 0.2s'
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: 18, height: 18 }} />
                            Log in with Google
                        </button>
                    </div>

                    <div style={{ marginTop: 40, textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
                        Don't have an account? <button onClick={onSignup} style={{ fontWeight: 600, color: '#1E40AF', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Create an Account</button>
                    </div>

                    <div style={{ marginTop: 60, display: 'flex', justifyContent: 'center', gap: 24, fontSize: 11, color: 'var(--text-disabled)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
                        <span>•</span>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
                        <span>•</span>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Help Center</a>
                    </div>
                </div>
            </div>

            {/* Animations */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes handsUp {
                    from { opacity: 0; transform: translate(-50%, -30%); }
                    to { opacity: 1; transform: translate(-50%, -60%); }
                }
                @keyframes charBounce0 {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
                @keyframes charBounce1 {
                    0%, 100% { transform: translateY(0); }
                    33% { transform: translateY(-4px); }
                }
                @keyframes charBounce2 {
                    0%, 100% { transform: translateY(0); }
                    60% { transform: translateY(-8px); }
                }
                @keyframes charBounce3 {
                    0%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-5px); }
                }
                @media (max-width: 768px) {
                    .login-left { display: none !important; }
                    .login-right { max-width: 100% !important; padding: 24px !important; }
                }
            `}</style>
        </div>
    );
};

export default Login;
