import React, { useState, useEffect } from 'react';
import { Camera, Menu, X, Sun, Moon } from 'lucide-react';

const Header = ({ view, setView, setShowSupport }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLight, setIsLight] = useState(() => {
        return localStorage.getItem('theme') === 'light';
    });

    useEffect(() => {
        if (isLight) {
            document.body.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        }
    }, [isLight]);

    const handleNavClick = (width, action) => {
        action();
        setMobileMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <header style={{
            position: 'sticky', top: 0, zIndex: 50,
            background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-dark)',
            padding: '0 24px'
        }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', height: 72, alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => handleNavClick(null, () => setView('home'))}>
                    <div style={{ width: 36, height: 36, background: '#2563EB', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <Camera style={{ width: 20, height: 20 }} />
                    </div>
                    <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        SelfieSe<span style={{ color: '#2563EB' }}>Passport</span>
                    </span>
                </div>

                {/* Desktop Nav */}
                <nav className="header-nav" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted-dark)' }}>
                    {['Home', 'Photo Guidelines', 'Support'].map(item => (
                        <a key={item} href="#" style={{
                            color: view === item.toLowerCase() || (item === 'Photo Guidelines' && view === 'guidelines') ? '#2563EB' : 'inherit',
                            textDecoration: 'none',
                            transition: 'color 0.2s'
                        }}
                            onClick={(e) => {
                                e.preventDefault();
                                if (item === 'Home') handleNavClick(null, () => setView('home'));
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
                        onClick={() => setIsLight(!isLight)}
                        title="Toggle Theme"
                        style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px' }}
                    >
                        {isLight ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div style={{
                    position: 'absolute', top: 72, left: 0, right: 0,
                    background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)',
                    padding: '24px', display: 'flex', flexDirection: 'column', gap: 24,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                    zIndex: 100
                }}>
                    {['Home', 'Photo Guidelines', 'Support'].map(item => (
                        <a key={item} href="#" style={{
                            fontSize: 16, fontWeight: 600,
                            color: view === item.toLowerCase() || (item === 'Photo Guidelines' && view === 'guidelines') ? '#2563EB' : 'var(--text-primary)',
                            textDecoration: 'none'
                        }}
                            onClick={(e) => {
                                e.preventDefault();
                                if (item === 'Home') handleNavClick(null, () => setView('home'));
                                else if (item === 'Photo Guidelines') handleNavClick(null, () => setView('guidelines'));
                                else if (item === 'Support') {
                                    setShowSupport(true);
                                    setMobileMenuOpen(false);
                                }
                            }}
                        >{item}</a>
                    ))}
                </div>
            )}
            <style>{`
                @media (max-width: 640px) {
                    .header-nav { display: none !important; }
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
