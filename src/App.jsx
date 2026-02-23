import { useState } from 'react';
import { ShieldCheck, Scissors, ArrowRight, Camera, Printer, FileText, CheckCircle, Lock, BadgeCheck } from 'lucide-react';
import Editor from './components/Editor';
import UploadSection from './components/UploadSection';
import Login from './components/Login';
import Signup from './components/Signup';
import Pricing from './components/Pricing';
import PhotoGuidelines from './components/PhotoGuidelines';
import OrderPrints from './components/OrderPrints';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import GlobalModals from './components/GlobalModals';

import Header from './components/Header';
import { documentTypes } from './data/countries';

function App() {
  const [images, setImages] = useState([]);
  const [view, setView] = useState('home'); // 'home', 'login', 'signup', 'order', 'pricing', 'guidelines', 'privacy', 'terms'
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [orderImage, setOrderImage] = useState(null);
  const [orderSheetLabel, setOrderSheetLabel] = useState('A4');

  const handleUpload = (imageDataUrls) => {
    setImages(imageDataUrls);
  };

  const handleOrder = (img, label) => {
    setOrderImage(img);
    setOrderSheetLabel(label);
    setView('order');
  };

  if (view === 'login') {
    return <Login onBack={() => setView('home')} onSignup={() => setView('signup')} />;
  }

  if (view === 'signup') {
    return <Signup onLogin={() => setView('login')} onBack={() => setView('home')} />;
  }

  if (view === 'pricing') {
    return (
      <>

        <Header view={view} setView={setView} setShowSupport={setShowSupport} onLogin={() => setView('login')} />
        <Pricing
          onOrder={() => setView('home')}
          onNavigate={(page) => {
            setView(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSupport={() => setShowSupport(true)}
          onUpgrade={() => setShowSubscription(true)}
        />
        <GlobalModals
          showPrivacy={showPrivacy} setShowPrivacy={setShowPrivacy}
          showRefund={showRefund} setShowRefund={setShowRefund}
          showSupport={showSupport} setShowSupport={setShowSupport}
          showSubscription={showSubscription} setShowSubscription={setShowSubscription}
        />
      </>
    );
  }

  if (view === 'guidelines') {
    return (
      <>

        <Header view={view} setView={setView} setShowSupport={setShowSupport} onLogin={() => setView('login')} />
        <PhotoGuidelines />
        <GlobalModals
          showPrivacy={showPrivacy} setShowPrivacy={setShowPrivacy}
          showRefund={showRefund} setShowRefund={setShowRefund}
          showSupport={showSupport} setShowSupport={setShowSupport}
        />
      </>
    );
  }

  if (view === 'privacy') {
    return (
      <>

        <Header view={view} setView={setView} setShowSupport={setShowSupport} onLogin={() => setView('login')} />
        <PrivacyPolicy />
        <GlobalModals
          showPrivacy={showPrivacy} setShowPrivacy={setShowPrivacy}
          showRefund={showRefund} setShowRefund={setShowRefund}
          showSupport={showSupport} setShowSupport={setShowSupport}
        />
      </>
    );
  }

  if (view === 'terms') {
    return (
      <>

        <Header view={view} setView={setView} setShowSupport={setShowSupport} onLogin={() => setView('login')} />
        <TermsOfService />
        <GlobalModals
          showPrivacy={showPrivacy} setShowPrivacy={setShowPrivacy}
          showRefund={showRefund} setShowRefund={setShowRefund}
          showSupport={showSupport} setShowSupport={setShowSupport}
        />
      </>
    );
  }

  if (view === 'order' && orderImage) {
    return (
      <>
        <OrderPrints image={orderImage} sheetLabel={orderSheetLabel} onBack={() => setView('home')} />
        <GlobalModals
          showPrivacy={showPrivacy} setShowPrivacy={setShowPrivacy}
          showRefund={showRefund} setShowRefund={setShowRefund}
          showSupport={showSupport} setShowSupport={setShowSupport}
        />
      </>
    );
  }

  if (images.length > 0) {
    return (
      <>
        <Editor
          images={images}
          onCancel={() => setImages([])}
          onOrder={handleOrder}
          onRemoveImage={(index) => {
            const newImages = images.filter((_, i) => i !== index);
            setImages(newImages);
          }}
        />
        <GlobalModals
          showPrivacy={showPrivacy} setShowPrivacy={setShowPrivacy}
          showRefund={showRefund} setShowRefund={setShowRefund}
          showSupport={showSupport} setShowSupport={setShowSupport}
        />
      </>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <Header view={view} setView={setView} setShowSupport={setShowSupport} onLogin={() => setView('login')} />

      {/* Hero Section */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px 40px' }}>
        <div className="hero-section">
          {/* Left */}
          <div style={{ flex: 1, maxWidth: 560 }}>


            <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1, color: '#0F172A', marginBottom: 20, letterSpacing: '-0.03em' }}>
              Perfect Passport<br />Photos <span style={{ color: '#2563EB' }}>in 30s.</span>
            </h1>

            <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.7, marginBottom: 32, maxWidth: 460 }}>
              Generate compliant photos for Passport, PAN, Aadhaar, and Govt Job Applications with AI-powered biometric verification, designed to meet approved photo specifications and recognized document requirements.
            </p>

            <div style={{
              background: '#fff', padding: 8, borderRadius: 24,
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px solid #F1F5F9'
            }}>
              <UploadSection onUpload={handleUpload} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, opacity: 0.7 }}>
              <div style={{ display: 'flex' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: '#E2E8F0', border: '2px solid #fff',
                    marginLeft: i > 1 ? -10 : 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: '#64748B'
                  }}>U{i}</div>
                ))}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>
                <strong style={{ color: '#0F172A' }}>50,000+</strong> Indian citizens trust us
              </span>
            </div>
          </div>

          {/* Right: Visualizer */}
          <div style={{ flex: 1, maxWidth: 520, display: 'none' }} className="hero-right">
            <div style={{
              background: '#fff', borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              border: '1px solid #F1F5F9', padding: 28, position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: 20, right: 24, display: 'flex', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F87171' }}></div>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FBBF24' }}></div>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#34D399' }}></div>
              </div>

              <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
                Passport Photo AI Validation
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Step 1: Original', bg: '#E2E8F0', opacity: 0.5 },
                  { label: 'Step 2: AI Scan', bg: '#DBEAFE', ring: '#3B82F6' },
                  { label: 'Step 3: Ready', bg: '#DCFCE7', ring: '#22C55E' }
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{
                      aspectRatio: '3/4', borderRadius: 12, background: s.bg,
                      opacity: s.opacity || 1,
                      outline: s.ring ? `2px solid ${s.ring}` : 'none',
                      outlineOffset: 3,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {i === 1 && <Scissors style={{ width: 24, height: 24, color: '#3B82F6' }} />}
                      {i === 2 && <ShieldCheck style={{ width: 24, height: 24, color: '#22C55E' }} />}
                    </div>
                    <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#64748B' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div style={{
                background: '#F8FAFC', borderRadius: 12, padding: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                border: '1px solid #F1F5F9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Passport Photo</p>
                    <p style={{ fontSize: 11, color: '#94A3B8' }}>35mm × 45mm • White Background</p>
                  </div>
                </div>
                <div style={{
                  background: '#DCFCE7', color: '#15803D', fontSize: 11, fontWeight: 700,
                  padding: '4px 10px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4
                }}>
                  <CheckCircle style={{ width: 12, height: 12 }} /> 99.9%
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 24px', background: '#fff', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div className="features-grid">
          {[
            { icon: '✨', title: 'Instant BG Removal', desc: 'Convert any background to official white or white in two clicks.' },
            { icon: '🎯', title: 'Eye-Active Detection', desc: 'AI checks for closed eyes, red-eye, and ensures a natural look per Indian norms.' },
            { icon: '🖨️', title: 'Multi-Layout Printing', desc: 'Print-ready layouts in A4, 4x6 and sizes for easy printing.' },
            { icon: '🖼️', title: 'Multiple Different Photos at Once', desc: 'Generate multiple different passport-size photos in a single click for instant printing.' }
          ].map((f, i) => (
            <div key={i} style={{ textAlign: 'center', padding: 8 }}>
              <div style={{
                width: 56, height: 56, margin: '0 auto 16px', background: '#EFF6FF',
                borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28
              }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Document Type Selection */}
      <section style={{ padding: '60px 24px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 48px' }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>Select Your Document Type</h2>
            <p style={{ fontSize: 14, color: '#64748B' }}>Choose Indian Passport size or enter custom dimensions for any document.</p>
          </div>

          <div className="doc-type-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, maxWidth: 700, margin: '0 auto' }}>
            {documentTypes.map((doc) => (
              <div key={doc.id} style={{
                background: '#fff', padding: 24, borderRadius: 16,
                border: '1px solid #E2E8F0', cursor: 'pointer',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 16
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: '#EFF6FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0
                }}>{doc.icon}</div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{doc.name}</h4>
                  <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{doc.dims}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Layout Preview */}


      {/* CTA */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            borderRadius: 24, padding: '64px 40px', textAlign: 'center', color: '#fff',
            position: 'relative', overflow: 'hidden'
          }} className="cta-section">
            <div style={{ position: 'absolute', top: -60, left: -60, width: 200, height: 200, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', bottom: -80, right: -80, width: 250, height: 250, background: 'rgba(99,102,241,0.2)', borderRadius: '50%' }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 className="cta-heading" style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
                Get Your Compliant Indian<br />Passport Photo Today
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>
                Simple, fast, and 100% compliant with Ministry of External Affairs standards.
              </p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>
                Join 50,000+ Happy Users
              </p>
              <div className="cta-buttons" style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  style={{
                    background: '#fff', color: '#2563EB', border: 'none',
                    padding: '14px 32px', borderRadius: 12, fontWeight: 700, fontSize: 14,
                    cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                  }}
                >Upload Your Photo</button>
                <button
                  onClick={() => setView('pricing')}
                  style={{
                    background: 'rgba(255,255,255,0.15)', color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '14px 32px', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer'
                  }}>See Pricing</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', padding: '60px 24px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, background: '#2563EB', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Camera style={{ width: 16, height: 16 }} />
                </div>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
                  SelfieSe<span style={{ color: '#2563EB' }}>Passport</span>
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#64748B', maxWidth: 280, lineHeight: 1.7, marginBottom: 16 }}>
                Trusted biometric photo processor built to meet official document standards.
              </p>

            </div>

            {[
              { title: 'Quick Links', links: ['Pricing', 'Refund Policy', 'Contact Support', 'Privacy Policy', 'Terms of Service'] }
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>{col.title}</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {col.links.map(link => (
                    <li key={link} style={{ marginBottom: 12 }}>
                      <a href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (link === 'Privacy Policy') {
                            setView('privacy');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          } else if (link === 'Terms of Service') {
                            setView('terms');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          } else if (link === 'Pricing') {
                            setView('pricing');
                          } else if (link === 'Contact Support') {
                            setShowSupport(true);
                          } else if (link === 'Refund Policy') {
                            setShowRefund(true);
                          }
                        }}
                        style={{ fontSize: 13, color: '#64748B', textDecoration: 'none' }}
                        onMouseEnter={e => e.target.style.color = '#2563EB'}
                        onMouseLeave={e => e.target.style.color = '#64748B'}
                      >{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="footer-bottom" style={{
            borderTop: '1px solid #E2E8F0', paddingTop: 20,
            fontSize: 12, color: '#94A3B8'
          }}>
            <p>©2026 SelfieSePassport. Professional document photo services.</p>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Lock style={{ width: 14, height: 14, color: '#22C55E' }} /> SSL Encrypted
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <BadgeCheck style={{ width: 14, height: 14, color: '#2563EB' }} /> PCI Compliant
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals for Privacy, Refund, and Support */}
      <GlobalModals
        showPrivacy={showPrivacy} setShowPrivacy={setShowPrivacy}
        showRefund={showRefund} setShowRefund={setShowRefund}
        showSupport={showSupport} setShowSupport={setShowSupport}
        showSubscription={showSubscription} setShowSubscription={setShowSubscription}
      />

      {/* Responsive media query via style tag */}
      <style>{`
        @media (min-width: 1024px) {
          .hero-right { display: block !important; }
        }
        @media (max-width: 1023px) {
          .hero-right { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default App;
