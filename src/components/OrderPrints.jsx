
import React, { useState } from 'react';
import { Camera, CheckCircle, Smartphone, MapPin, CreditCard, ShieldCheck, Truck, Star, ArrowLeft } from 'lucide-react';

const OrderPrints = ({ image, sheetLabel = 'A4', onBack }) => {
    const [quantity, setQuantity] = useState(1);
    const [pincode, setPincode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [loadingPincode, setLoadingPincode] = useState(false);

    const pricePerSheet = (sheetLabel.includes('4x6') || sheetLabel.includes('4×6')) ? 49 : 84;
    const deliveryCharge = 15;
    const subtotal = quantity * pricePerSheet;
    const totalAmount = subtotal + deliveryCharge;

    const handleIncrement = () => setQuantity(q => q + 1);
    const handleDecrement = () => setQuantity(q => Math.max(1, q - 1));

    const handlePincodeChange = async (e) => {
        const code = e.target.value.replace(/\D/g, '').slice(0, 6);
        setPincode(code);

        if (code.length === 6) {
            setLoadingPincode(true);
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${code}`);
                const data = await response.json();
                if (data[0].Status === 'Success') {
                    const postOffice = data[0].PostOffice[0];
                    setCity(postOffice.District);
                    setState(postOffice.State);
                }
            } catch (error) {
                console.error("Failed to fetch pincode details", error);
            }
            setLoadingPincode(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', fontFamily: "'Inter', sans-serif" }}>
            {/* ... Header & Steps ... */}
            <header style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)', padding: '16px 24px' }}>
                    <div className="order-header-inner" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={onBack}>
                        <div style={{ width: 32, height: 32, background: '#2563EB', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <Camera style={{ width: 18, height: 18 }} />
                        </div>
                        <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                            SelfieSe<span style={{ color: '#2563EB' }}>Passport</span>
                        </span>
                    </div>
                    <div className="order-secure-text" style={{ fontSize: 13, color: 'var(--text-muted-dark)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ShieldCheck style={{ width: 14, height: 14, color: '#22C55E' }} /> 100% Secure Checkout
                    </div>
                </div>
            </header>

            {/* Steps */}
            <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)', padding: '16px 0' }}>
                <div className="order-steps-bar" style={{ maxWidth: 600, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.5 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#2563EB', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Upload</span>
                    </div>
                    <div className="step-line" style={{ width: 40, height: 1, background: '#27273A' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#2563EB', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Checkout</span>
                    </div>
                    <div className="step-line" style={{ width: 40, height: 1, background: '#27273A' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.5 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#27273A', color: 'var(--text-muted-dark)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted-dark)' }}>Success</span>
                    </div>
                </div>
            </div>

            <main className="order-main" style={{ maxWidth: 1200, margin: '32px auto', padding: '0 24px', display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>

                {/* Left: Summary & Preview */}
                <div style={{ flex: 1, minWidth: 320 }}>
                    <div style={{ background: 'var(--bg-primary)', borderRadius: 16, border: '1px solid var(--border-light)', padding: 24, marginBottom: 24 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Order Summary</h2>
                        <p style={{ fontSize: 14, color: 'var(--text-muted-dark)', marginBottom: 20 }}>Preview your custom photo layout</p>

                        <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 24, display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                            <img src={image} alt="Print Preview" style={{ maxWidth: '100%', maxHeight: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.6)', borderRadius: 4 }} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg-accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                                <CreditCard style={{ width: 20, height: 20 }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{sheetLabel} Sheet (Multi-Photo)</h3>
                                <p style={{ fontSize: 13, color: 'var(--text-muted-dark)', marginTop: 2 }}>Premium photographic paper with standard sizing.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginTop: 16 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg-accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                                <Star style={{ width: 20, height: 20 }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Matte Finish</h3>
                                <p style={{ fontSize: 13, color: 'var(--text-muted-dark)', marginTop: 2 }}>Non-reflective, professional finish suitable for all official documents.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border-light)' }}>
                            <span style={{ fontSize: 14, color: 'var(--text-muted-dark)' }}>Total Print Units</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <button onClick={handleDecrement} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--text-muted-dark)' }}>-</button>
                                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{quantity} Sheet{quantity > 1 ? 's' : ''}</span>
                                <button onClick={handleIncrement} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: 'var(--text-muted-dark)' }}>+</button>
                            </div>
                        </div>
                    </div>

                    <div className="order-trust-badges" style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                        {/* ... Trust Badges ... */}
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <Truck style={{ width: 24, height: 24, color: '#2563EB', marginBottom: 8 }} />
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>FAST DELIVERY</div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <Star style={{ width: 24, height: 24, color: '#2563EB', marginBottom: 8 }} />
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>PREMIUM QUALITY</div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <ShieldCheck style={{ width: 24, height: 24, color: '#2563EB', marginBottom: 8 }} />
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>100% PRIVATE</div>
                        </div>
                    </div>
                </div>

                {/* Right: Checkout Form */}
                <div style={{ flex: 1, minWidth: 320, maxWidth: 480 }}>
                    <div style={{ background: 'var(--bg-primary)', borderRadius: 16, border: '1px solid var(--border-light)', padding: 24 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>Delivery Details</h2>

                        <form onSubmit={e => e.preventDefault()}>
                            {/* ... Inputs ... */}
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6 }}>Full Name</label>
                                <input type="text" placeholder="E.g. Rajesh Kumar" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-light)', fontSize: 14, outline: 'none' }} />
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6 }}>Mobile Number</label>
                                <div style={{ display: 'flex' }}>
                                    <span style={{ padding: '10px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: 14, color: 'var(--text-muted-dark)' }}>+91</span>
                                    <input type="tel" placeholder="9876543210" style={{ flex: 1, padding: '10px 12px', borderRadius: '0 8px 8px 0', border: '1px solid var(--border-light)', fontSize: 14, outline: 'none' }} />
                                </div>
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6 }}>Delivery Address</label>
                                <textarea rows={3} placeholder="Flat No, Street, Area" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-light)', fontSize: 14, outline: 'none', resize: 'none' }}></textarea>
                            </div>

                            <div className="order-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6 }}>Pincode</label>
                                    <input
                                        type="text"
                                        placeholder="6-digit Pincode"
                                        value={pincode}
                                        onChange={handlePincodeChange}
                                        maxLength={6}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${loadingPincode ? '#2563EB' : '#E2E8F0'}`, fontSize: 14, outline: 'none' }}
                                    />
                                    {loadingPincode && <span style={{ fontSize: 11, color: '#2563EB', marginTop: 4, display: 'block' }}>Fetching details...</span>}
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6 }}>City</label>
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={city}
                                        readOnly
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-light)', background: 'var(--bg-secondary)', fontSize: 14, outline: 'none', color: 'var(--text-muted-dark)' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6 }}>State</label>
                                <input
                                    type="text"
                                    placeholder="State"
                                    value={state}
                                    readOnly
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-light)', background: 'var(--bg-secondary)', fontSize: 14, outline: 'none', color: 'var(--text-muted-dark)' }}
                                />
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 20, marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontSize: 14, color: 'var(--text-muted-dark)' }}>Subtotal ({quantity} {quantity > 1 ? 'items' : 'item'})</span>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>₹{subtotal}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                    <span style={{ fontSize: 14, color: 'var(--text-muted-dark)' }}>Delivery Charge</span>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: '#22C55E' }}>₹{deliveryCharge}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Total Amount</span>
                                    <span style={{ fontSize: 24, fontWeight: 800, color: '#2563EB' }}>₹{totalAmount}</span>
                                </div>
                            </div>

                            <button style={{
                                width: '100%', background: '#2563EB', color: '#fff', border: 'none',
                                padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 700,
                                cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                            }}>
                                Pay ₹{totalAmount} & Place Order <ArrowLeft style={{ width: 18, height: 18, transform: 'rotate(180deg)' }} />
                            </button>

                            <div style={{ marginTop: 20, textAlign: 'center' }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-disabled)', letterSpacing: '0.05em', marginBottom: 8 }}>SUPPORTED PAYMENT METHODS</p>
                                <div className="payment-methods" style={{ display: 'flex', justifyContent: 'center', gap: 8, opacity: 0.7 }}>
                                    <div style={{ padding: '4px 8px', background: 'var(--bg-tertiary)', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>GPay</div>
                                    <div style={{ padding: '4px 8px', background: 'var(--bg-tertiary)', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>Paytm</div>
                                    <div style={{ padding: '4px 8px', background: 'var(--bg-tertiary)', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>VISA</div>
                                    <div style={{ padding: '4px 8px', background: 'var(--bg-tertiary)', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>RuPay</div>

                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 12, color: 'var(--text-disabled)', fontSize: 11 }}>
                                    <ShieldCheck style={{ width: 12, height: 12 }} /> Secure 256-bit SSL Encrypted Payment
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderPrints;
