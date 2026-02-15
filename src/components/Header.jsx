import React, { useState } from 'react';
import { Camera, Menu, X } from 'lucide-react';

const Header = ({ view, setView, setShowSupport, onLogin }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleNavClick = (width, action) => {
        action();
        setMobileMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <header style={{
            position: 'sticky', top: 0, zIndex: 50,
            background: '#fff', borderBottom: '1px solid #F1F5F9',
            padding: '0 24px'
        }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', height: 72, alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => handleNavClick(null, () => setView('home'))}>
                    <div style={{ width: 36, height: 36, background: '#2563EB', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <Camera style={{ width: 20, height: 20 }} />
                    </div>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                        SelfieSe<span style={{ color: '#2563EB' }}>Passport</span>
                    </span>
                </div>

                {/* Desktop Nav */}
                <nav className="header-nav" style={{ fontSize: 14, fontWeight: 500, color: '#64748B' }}>
                    {['Home', 'Pricing', 'Photo Guidelines', 'Support'].map(item => (
                        <a key={item} href="#" style={{
                            color: view === item.toLowerCase() || (item === 'Photo Guidelines' && view === 'guidelines') ? '#2563EB' : 'inherit',
                            textDecoration: 'none',
                            transition: 'color 0.2s'
                        }}
                            onClick={(e) => {
                                e.preventDefault();
                                if (item === 'Pricing') handleNavClick(null, () => setView('pricing'));
                                else if (item === 'Home') handleNavClick(null, () => setView('home'));
                                else if (item === 'Photo Guidelines') handleNavClick(null, () => setView('guidelines'));
                                else if (item === 'Support') {
                                    e.preventDefault();
                                    setShowSupport(true);
                                }
                            }}
                            onMouseEnter={e => e.target.style.color = '#2563EB'}
                            onMouseLeave={e => e.target.style.color = listColor(item)}
                        >{item}</a>
                    ))}
                </nav>

                <div className="header-actions">
                    <button
                        className="login-btn"
                        onClick={onLogin}
                        style={{ background: 'none', border: 'none', fontSize: 14, fontWeight: 500, color: '#475569', cursor: 'pointer' }}
                    >
                        Login
                    </button>
                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#0F172A' }}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div style={{
                    position: 'absolute', top: 72, left: 0, right: 0,
                    background: '#fff', borderBottom: '1px solid #E2E8F0',
                    padding: '24px', display: 'flex', flexDirection: 'column', gap: 24,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}>
                    {['Home', 'Pricing', 'Photo Guidelines', 'Support'].map(item => (
                        <a key={item} href="#" style={{
                            fontSize: 16, fontWeight: 600,
                            color: view === item.toLowerCase() || (item === 'Photo Guidelines' && view === 'guidelines') ? '#2563EB' : '#0F172A',
                            textDecoration: 'none'
                        }}
                            onClick={(e) => {
                                e.preventDefault();
                                if (item === 'Pricing') handleNavClick(null, () => setView('pricing'));
                                else if (item === 'Home') handleNavClick(null, () => setView('home'));
                                else if (item === 'Photo Guidelines') handleNavClick(null, () => setView('guidelines'));
                                else if (item === 'Support') {
                                    setShowSupport(true);
                                    setMobileMenuOpen(false);
                                }
                            }}
                        >{item}</a>
                    ))}
                    <button
                        onClick={() => {
                            onLogin();
                            setMobileMenuOpen(false);
                        }}
                        style={{
                            background: '#EFF6FF', border: 'none', padding: '12px',
                            borderRadius: 8, fontSize: 15, fontWeight: 600, color: '#2563EB',
                            cursor: 'pointer', width: '100%', textAlign: 'center'
                        }}
                    >
                        Login
                    </button>
                </div>
            )}
            <style>{`
                @media (max-width: 640px) {
                    .header-nav { display: none !important; }
                    .header-actions .login-btn { display: none !important; }
                    .mobile-menu-btn { display: block !important; }
                }
            `}</style>
        </header>
    );

    function listColor(item) {
        return (view === item.toLowerCase() || (item === 'Photo Guidelines' && view === 'guidelines')) ? '#2563EB' : '#64748B';
    }
};

export default Header;
