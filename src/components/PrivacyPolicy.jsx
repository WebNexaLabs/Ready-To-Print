
const PrivacyPolicy = () => {
    return (
        <div className="content-page" style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 24 }}>Privacy Policy</h1>
                <p style={{ fontSize: 16, color: 'var(--text-muted-dark)', marginBottom: 40 }}>Effective Date: 15-02-2026</p>

                <p style={{ fontSize: 16, color: 'var(--text-tertiary)', lineHeight: 1.6, marginBottom: 32 }}>
                    At SelfieSePassport, we respect your privacy and are committed to protecting your personal data.
                </p>

                <section style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>1. Information We Collect</h2>
                    <ul style={{ paddingLeft: 20, fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        <li>Photos uploaded by users</li>
                        <li>Basic usage data (browser type, device, IP address)</li>
                        <li>Payment details (processed securely via third-party providers)</li>
                    </ul>
                </section>

                <section style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>2. How We Use Your Information</h2>
                    <ul style={{ paddingLeft: 20, fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        <li>To generate passport-size photos</li>
                        <li>To improve our AI processing</li>
                        <li>To provide customer support</li>
                        <li>To process payments</li>
                    </ul>
                </section>

                <section style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>3. Photo Storage</h2>
                    <ul style={{ paddingLeft: 20, fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        <li>Uploaded images are processed securely.</li>
                        <li>We do not permanently store your photos.</li>
                        <li>Images may be temporarily stored for processing and then automatically deleted.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>4. Data Security</h2>
                    <ul style={{ paddingLeft: 20, fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        <li>SSL (HTTPS) encryption is used.</li>
                        <li>We do not sell or share user data with third parties.</li>
                        <li>Payments are handled via secure, PCI-DSS compliant payment providers.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>5. Third-Party Services</h2>
                    <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        We may use trusted third-party services (e.g., hosting providers, payment gateways) to operate our platform securely.
                    </p>
                </section>

                <section style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>6. Contact Us</h2>
                    <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 8 }}>If you have any privacy concerns:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <span style={{ fontSize: 16, color: 'var(--text-tertiary)' }}>📧 Email: <strong>anupmondal345gmail.com</strong></span>
                        <span style={{ fontSize: 16, color: 'var(--text-tertiary)' }}>📱 Contact: <strong>8617371378</strong></span>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
