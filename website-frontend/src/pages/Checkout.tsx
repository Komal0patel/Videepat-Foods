import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, CreditCard, Truck, ShieldCheck, MapPin, Phone, User, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#0a0d08',
        color: '#f1f5f9',
        fontFamily: "'Outfit', sans-serif",
        paddingTop: '120px',
        paddingBottom: '100px',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)',
        gap: '48px',
    },
    section: {
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '32px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '40px',
        marginBottom: '32px',
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: 800,
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontFamily: "'Playfair Display', serif",
    },
    inputGroup: {
        marginBottom: '24px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: 600,
        color: '#94a3b8',
        marginBottom: '8px',
    },
    input: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '16px',
        color: '#ffffff',
        fontSize: '16px',
        outline: 'none',
        transition: 'all 0.3s ease',
    },
    summaryItem: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '16px',
        fontSize: '16px',
        color: '#94a3b8',
    },
    total: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '24px',
        paddingTop: '24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '24px',
        fontWeight: 900,
        color: '#ffffff',
    },
    orderBtn: {
        width: '100%',
        background: 'linear-gradient(135deg, #5c8d37 0%, #3e5e25 100%)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '100px',
        padding: '20px',
        fontSize: '18px',
        fontWeight: 800,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '32px',
        boxShadow: '0 20px 40px rgba(92, 141, 55, 0.2)',
    }
};

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pincode: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would normally send to backend
        alert('Order Placed Successfully! Returning to Home.');
        clearCart();
        navigate('/');
    };

    if (cartItems.length === 0) {
        return (
            <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={styles.container}>
                    <ShoppingBag size={80} color="#5c8d37" style={{ marginBottom: '24px' }} />
                    <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px' }}>Your Basket is Empty</h1>
                    <p style={{ color: '#94a3b8', marginBottom: '32px' }}>Add some village goodness before checking out.</p>
                    <Link to="/products" style={{ color: '#5c8d37', textDecoration: 'none', fontWeight: 800, fontSize: '18px' }}>
                        Browse Market
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <header style={{ marginBottom: '48px' }}>
                    <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#94a3b8', textDecoration: 'none', fontWeight: 600, marginBottom: '24px' }}>
                        <ArrowLeft size={18} /> Back to Market
                    </Link>
                    <h1 style={{ fontSize: '48px', fontWeight: 900, fontFamily: "'Playfair Display', serif" }}>Finalize Your Harvest</h1>
                </header>

                <div style={styles.grid}>
                    <div style={{ paddingRight: '20px' }}>
                        <form onSubmit={handleSubmit}>
                            <div style={styles.section}>
                                <h2 style={styles.sectionTitle}><User size={24} color="#5c8d37" /> Personal Details</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Full Name</label>
                                        <input
                                            type="text"
                                            style={styles.input}
                                            required
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Phone Number</label>
                                        <input
                                            type="tel"
                                            style={styles.input}
                                            required
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Email Address</label>
                                    <input
                                        type="email"
                                        style={styles.input}
                                        required
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={styles.section}>
                                <h2 style={styles.sectionTitle}><MapPin size={24} color="#5c8d37" /> Delivery Address</h2>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Street Address</label>
                                    <textarea
                                        style={{ ...styles.input, height: '100px', resize: 'none' }}
                                        required
                                        placeholder="Apartment, suite, unit, etc."
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>City</label>
                                        <input
                                            type="text"
                                            style={styles.input}
                                            required
                                            placeholder="Bengaluru"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Pincode</label>
                                        <input
                                            type="text"
                                            style={styles.input}
                                            required
                                            placeholder="560001"
                                            value={formData.pincode}
                                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={styles.section}>
                                <h2 style={styles.sectionTitle}><CreditCard size={24} color="#5c8d37" /> Payment Method</h2>
                                <div style={{ padding: '24px', borderRadius: '20px', border: '1px solid #5c8d37', background: 'rgba(92, 141, 55, 0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '6px solid #5c8d37' }} />
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '18px' }}>Cash on Delivery</div>
                                        <div style={{ color: '#94a3b8', fontSize: '14px' }}>Pay when you receive your village treats.</div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div>
                        <div style={{ position: 'sticky', top: '140px' }}>
                            <div style={styles.section}>
                                <h2 style={styles.sectionTitle}>Order Summary</h2>
                                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '32px' }}>
                                    {cartItems.map(item => (
                                        <div key={item._id} style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                                            <img src={item.image} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 700 }}>{item.name}</div>
                                                <div style={{ color: '#94a3b8', fontSize: '14px' }}>Qty: {item.quantity}</div>
                                            </div>
                                            <div style={{ fontWeight: 800 }}>₹{(item.price * item.quantity).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>

                                <div style={styles.summaryItem}>
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div style={styles.summaryItem}>
                                    <span>Delivery Fee</span>
                                    <span style={{ color: '#5c8d37', fontWeight: 700 }}>FREE</span>
                                </div>
                                <div style={styles.total}>
                                    <span>Grand Total</span>
                                    <span>₹{cartTotal.toFixed(2)}</span>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={styles.orderBtn}
                                    onClick={handleSubmit}
                                >
                                    Confirm Harvest Order <ChevronRight size={20} />
                                </motion.button>

                                <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                                        <ShieldCheck size={20} color="#5c8d37" style={{ margin: '0 auto 8px' }} />
                                        Secure Ordering
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                                        <Truck size={20} color="#5c8d37" style={{ margin: '0 auto 8px' }} />
                                        Fast Delivery
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                                        <Phone size={20} color="#5c8d37" style={{ margin: '0 auto 8px' }} />
                                        24/7 Support
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
