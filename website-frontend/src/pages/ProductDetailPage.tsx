import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Leaf, ArrowLeft, ShoppingBag, ShieldCheck, Truck, Clock, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category_ids: string[];
    stock: number;
    is_active: boolean;
    attributes?: {
        ingredients?: string[];
        allergens?: string[];
        nutrition?: Record<string, string>;
    };
}

const API_URL = 'http://localhost:8000/api';

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#0a0d08',
        color: '#f1f5f9',
        fontFamily: "'Outfit', sans-serif",
        paddingTop: '80px',
    },
    header: {
        backgroundColor: 'rgba(10, 13, 8, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(92, 141, 55, 0.1)',
        position: 'fixed' as const,
        width: '100%',
        top: 0,
        zIndex: 100,
        padding: '16px 0',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
    },
    productGrid: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
        gap: '64px',
        paddingTop: '40px',
    },
    imageSection: {
        position: 'relative' as const,
    },
    mainImageContainer: {
        width: '100%',
        aspectRatio: '1/1',
        borderRadius: '32px',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '24px',
    },
    mainImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
    },
    thumbnailGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
    },
    thumbnail: {
        width: '100%',
        aspectRatio: '1/1',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '2px solid transparent',
        transition: 'all 0.3s ease',
    },
    infoSection: {
        display: 'flex',
        flexDirection: 'column' as const,
    },
    categoryTag: {
        color: '#5c8d37',
        fontWeight: 900,
        textTransform: 'uppercase' as const,
        letterSpacing: '2px',
        fontSize: '14px',
        marginBottom: '16px',
        display: 'block',
    },
    productTitle: {
        fontSize: 'clamp(32px, 4vw, 48px)',
        fontWeight: 900,
        color: '#ffffff',
        marginBottom: '24px',
        lineHeight: 1.1,
        fontFamily: "'Playfair Display', serif",
    },
    priceTag: {
        fontSize: '36px',
        fontWeight: 900,
        color: '#ffffff',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'baseline',
        gap: '8px',
    },
    description: {
        fontSize: '18px',
        color: '#94a3b8',
        lineHeight: 1.8,
        marginBottom: '40px',
    },
    actionSection: {
        display: 'flex',
        gap: '16px',
        marginBottom: '48px',
    },
    qtySelector: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '100px',
        padding: '8px',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    qtyBtn: {
        width: '40px',
        height: '40px',
        borderRadius: '50px',
        border: 'none',
        background: 'transparent',
        color: '#ffffff',
        fontSize: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addToCartBtn: {
        flex: 1,
        background: 'linear-gradient(135deg, #5c8d37 0%, #3e5e25 100%)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '100px',
        padding: '0 32px',
        fontSize: '18px',
        fontWeight: 800,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        boxShadow: '0 20px 40px rgba(92, 141, 55, 0.2)',
    },
    badgesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        paddingTop: '32px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
    },
    badgeItem: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        textAlign: 'center' as const,
        gap: '12px',
    },
    badgeIcon: {
        width: '48px',
        height: '48px',
        borderRadius: '16px',
        backgroundColor: 'rgba(92, 141, 55, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#5c8d37',
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: 800,
        color: '#ffffff',
        marginBottom: '24px',
        fontFamily: "'Playfair Display', serif",
    },
    ingredientTag: {
        display: 'inline-flex',
        padding: '8px 16px',
        borderRadius: '50px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        fontSize: '14px',
        fontWeight: 600,
        margin: '0 8px 8px 0',
    },
    similarGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '32px',
        marginTop: '40px',
    }
};

const resolveImageUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    return url;
};

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { addToCart, cartCount, setIsCartOpen } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const [prodRes, allProdRes] = await Promise.all([
                    fetch(`${API_URL}/products/${id}/`),
                    fetch(`${API_URL}/products/`)
                ]);

                const prodData = await prodRes.json();
                const allProdData = await allProdRes.json();

                setProduct(prodData);

                if (Array.isArray(allProdData) && prodData.category_ids) {
                    // Filter similar products by category
                    const similar = allProdData
                        .filter((p: Product) =>
                            p._id !== id &&
                            p.is_active &&
                            p.category_ids &&
                            p.category_ids.some(cat => prodData.category_ids.includes(cat))
                        )
                        .slice(0, 4);
                    setSimilarProducts(similar.length > 0 ? similar : allProdData.filter((p: Product) => p._id !== id).slice(0, 4));
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching product detail:', err);
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Leaf color="#5c8d37" size={64} />
                </motion.div>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px' }}>Harvest Not Found</h1>
                    <Link to="/products" style={{ color: '#5c8d37', textDecoration: 'none', fontWeight: 800 }}>View All Products</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <motion.div whileHover={{ x: -5 }}>
                            <ArrowLeft color="#ffffff" size={24} />
                        </motion.div>
                        <span style={{ color: '#ffffff', fontWeight: 700 }}>Back to Market</span>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            style={{
                                position: 'relative',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '12px',
                                borderRadius: '50px',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: -9,
                                    right: -9,
                                    background: '#5c8d37',
                                    color: 'white',
                                    fontSize: '11px',
                                    fontWeight: 900,
                                    padding: '4px 8px',
                                    borderRadius: '50px',
                                    boxShadow: '0 4px 12px rgba(92, 141, 55, 0.4)'
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <Leaf color="#5c8d37" size={32} />
                    </div>
                </div>
            </header>

            <main style={styles.container}>
                <div style={styles.productGrid}>
                    {/* Left: Images */}
                    <div style={styles.imageSection}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={styles.mainImageContainer}
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    src={resolveImageUrl(product.images[activeImage])}
                                    alt={product.name}
                                    style={styles.mainImage}
                                />
                            </AnimatePresence>
                        </motion.div>

                        {product.images.length > 1 && (
                            <div style={styles.thumbnailGrid}>
                                {product.images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            ...styles.thumbnail,
                                            borderColor: activeImage === idx ? '#5c8d37' : 'transparent',
                                            opacity: activeImage === idx ? 1 : 0.6
                                        }}
                                        onClick={() => setActiveImage(idx)}
                                    >
                                        <img src={resolveImageUrl(img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div style={styles.infoSection}>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <span style={styles.categoryTag}>{product.category_ids[0]}</span>
                            <h1 style={styles.productTitle}>{product.name}</h1>

                            <div style={styles.priceTag}>
                                ₹{Number(product.price).toFixed(2)}
                                <span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: 500 }}>Inc. all taxes</span>
                            </div>

                            <p style={styles.description}>{product.description}</p>

                            <div style={styles.actionSection}>
                                <div style={styles.qtySelector}>
                                    <button style={styles.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                    <span style={{ width: '40px', textAlign: 'center', fontWeight: 800, fontSize: '18px' }}>{quantity}</span>
                                    <button style={styles.qtyBtn} onClick={() => setQuantity(quantity + 1)}>+</button>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={styles.addToCartBtn}
                                    onClick={() => {
                                        addToCart({
                                            _id: product._id,
                                            name: product.name,
                                            price: Number(product.price),
                                            image: resolveImageUrl(product.images[0]),
                                            quantity: quantity
                                        });
                                    }}
                                >
                                    <ShoppingBag size={20} /> Add to Basket
                                </motion.button>
                            </div>

                            <div style={styles.badgesGrid}>
                                <div style={styles.badgeItem}>
                                    <div style={styles.badgeIcon}><Truck size={24} /></div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '14px' }}>Fast Delivery</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Within 24 hours</div>
                                    </div>
                                </div>
                                <div style={styles.badgeItem}>
                                    <div style={styles.badgeIcon}><ShieldCheck size={24} /></div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '14px' }}>Pure Organic</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Certified Farm</div>
                                    </div>
                                </div>
                                <div style={styles.badgeItem}>
                                    <div style={styles.badgeIcon}><Clock size={24} /></div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '14px' }}>Farm Fresh</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Picked Daily</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Details Sections */}
                <div style={{ marginTop: '100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={styles.sectionTitle}><Info size={20} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> Ingredients & Purity</h2>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            {product.attributes?.ingredients && product.attributes.ingredients.length > 0 ? (
                                <div>
                                    {product.attributes.ingredients.map((ing, i) => (
                                        <span key={i} style={styles.ingredientTag}>{ing}</span>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: '#94a3b8' }}>100% pure and natural, sourced directly from our village farms. No artificial additives or preservatives used.</p>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={styles.sectionTitle}><ShieldCheck size={20} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> Allergen Information</h2>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            {product.attributes?.allergens && product.attributes.allergens.length > 0 ? (
                                <ul style={{ margin: 0, paddingLeft: '20px', color: '#94a3b8' }}>
                                    {product.attributes.allergens.map((alg, i) => (
                                        <li key={i} style={{ marginBottom: '8px' }}>{alg}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ color: '#94a3b8' }}>This product is gluten-free and dairy-free. Processed in a facility that also handles nuts and grains.</p>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Similar Items */}
                <div style={{ marginTop: '120px', paddingBottom: '100px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '40px' }}>
                        <div>
                            <h2 style={{ ...styles.sectionTitle, marginBottom: '8px' }}>Similar Harvests</h2>
                            <p style={{ color: '#94a3b8' }}>Complements well with your current selection.</p>
                        </div>
                        <Link to="/products" style={{ color: '#5c8d37', textDecoration: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            View All <ChevronRight size={18} />
                        </Link>
                    </div>

                    <div style={styles.similarGrid}>
                        {similarProducts.map((p, idx) => (
                            <motion.div
                                key={p._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/products/${p._id}`)}
                            >
                                <div style={{ aspectRatio: '1/1', borderRadius: '24px', overflow: 'hidden', marginBottom: '16px', background: 'rgba(255,255,255,0.02)' }}>
                                    <img src={resolveImageUrl(p.images[0])} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>{p.name}</h3>
                                <div style={{ color: '#5c8d37', fontWeight: 900 }}>₹{Number(p.price).toFixed(2)}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            <footer style={{ padding: '80px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
                    <Leaf color="#5c8d37" size={24} />
                    <span style={{ fontWeight: 900, fontSize: '20px' }}>Village kitchen</span>
                </div>
                <p style={{ color: '#475569', fontSize: '14px' }}>&copy; 2024 Village Kitchen. Authenticity in every grain.</p>
            </footer>
        </div>
    );
}
