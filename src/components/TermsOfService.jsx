
const TermsOfService = () => {
    return (
        <div className="content-page" style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 24 }}>Terms of Service</h1>
                <p style={{ fontSize: 16, color: 'var(--text-muted-dark)', marginBottom: 40 }}>Effective Date: 15-02-2026</p>

                <p style={{ fontSize: 16, color: 'var(--text-tertiary)', lineHeight: 1.6, marginBottom: 32 }}>
                    By using SelfieSePassport, you agree to the following terms:
                </p>

                <section style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>1. Service Description</h2>
                    <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        SelfieSePassport provides AI-based passport photo generation services compliant with official size standards.
                    </p>
                </section>

                <section style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>2. User Responsibility</h2>
                    <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12 }}>You agree to:</p>
                    <ul style={{ paddingLeft: 20, fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        <li>Upload only your own photo or authorized images.</li>
                        <li>Follow the Photo Guidelines.</li>
                        <li>Not misuse the platform for illegal purposes.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>3. Refund Policy</h2>
                    <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        Refunds are provided only under the conditions mentioned in our Refund Policy section.
                    </p>
                </section>

                <section style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>4. Intellectual Property</h2>
                    <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        All website content, branding, and software belong to SelfieSePassport.
                    </p>
                </section>

                <section style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>5. Limitation of Liability</h2>
                    <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        We are not responsible for rejection due to incorrect user-uploaded images or failure to follow guidelines.
                    </p>
                </section>

                <section style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>6. Changes to Terms</h2>
                    <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        We may update these policies at any time. Continued use of the website means you accept the updated terms.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;
