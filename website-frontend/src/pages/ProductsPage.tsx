import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCart } from '../context/CartContext';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    category_ids: string[];
    is_active: boolean;
}

const API_URL = 'http://localhost:8000/api';

const resolveImageUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    return url;
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const { addToCart, cartCount, setIsCartOpen } = useCart();

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/products/`);
                const data = await res.json();
                setProducts(data.filter((p: Product) => p.is_active));
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = ['All', ...Array.from(new Set(products.flatMap(p => p.category_ids || [])))];
    const filteredProducts = selectedCategory === 'All' ? products : products.filter(p => p.category_ids.includes(selectedCategory));

    if (loading) {
        return (
            <div className="h-screen w-full bg-[#0a0d08] flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Leaf color="#5c8d37" size={64} />
                </motion.div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative bg-[#0a0d08] text-slate-200 font-sans min-h-screen selection:bg-[#5c8d37] selection:text-white overflow-hidden">

            {/* Fixed Background with Parallax */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div style={{ scale, y: yBg }} className="w-full h-full">
                    <div className="absolute inset-0 bg-[#0a0d08]/85 z-10" />
                    <img
                        src="/assets/products-bg.jpg"
                        alt="Village Market"
                        className="w-full h-full object-cover"
                        onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2670&auto=format&fit=crop'}
                    />
                </motion.div>
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-50 py-6 px-8 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm border-b border-white/5">
                <Link to="/" className="flex items-center gap-3 group">
                    <motion.div whileHover={{ x: -5 }}>
                        <ArrowLeft className="text-white" size={24} />
                    </motion.div>
                    <span className="text-white font-bold uppercase tracking-widest text-sm">Back to Kitchen</span>
                </Link>

                <div className="flex items-center gap-3">
                    <Leaf className="text-[#5c8d37]" size={32} />
                    <span className="text-xl font-black tracking-tight text-white font-serif italic">Our Menu</span>
                </div>

                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                    <ShoppingBag size={24} />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#5c8d37] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                            {cartCount}
                        </span>
                    )}
                </button>
            </header>

            {/* Main Content */}
            <main className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Title Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <motion.h1
                            className="text-6xl md:text-8xl font-black text-white mb-6 font-serif"
                            animate={{
                                textShadow: [
                                    "0 0 20px rgba(92, 141, 55, 0.3)",
                                    "0 0 40px rgba(92, 141, 55, 0.5)",
                                    "0 0 20px rgba(92, 141, 55, 0.3)"
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Daily <span className="italic text-[#5c8d37]">Village</span> Harvest
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-xl text-slate-400 max-w-2xl mx-auto"
                        >
                            Fresh from the fields, straight to your table
                        </motion.p>
                    </motion.div>

                    {/* Category Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-wrap gap-4 justify-center mb-16"
                    >
                        {categories.map((cat, idx) => (
                            <motion.button
                                key={cat}
                                initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ delay: idx * 0.1, type: "spring", bounce: 0.6 }}
                                whileHover={{ scale: 1.1, rotate: 2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all ${selectedCategory === cat
                                    ? 'bg-[#5c8d37] text-white shadow-lg shadow-[#5c8d37]/30'
                                    : 'bg-white/5 text-slate-400 border border-white/10 hover:border-[#5c8d37]/50'
                                    }`}
                            >
                                {cat}
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 80, rotateX: 25, scale: 0.8 }}
                                whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{
                                    duration: 0.7,
                                    delay: index * 0.12,
                                    type: "spring",
                                    bounce: 0.4
                                }}
                                whileHover={{ y: -15, scale: 1.03, rotateY: 3 }}
                                whileTap={{ scale: 0.98 }}
                                style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                                className="group relative"
                            >
                                <Link to={`/products/${product._id}`} className="block">
                                    <div className="aspect-[4/5] relative rounded-[2rem] overflow-hidden border border-white/10 bg-black/20 backdrop-blur-sm shadow-2xl transition-all duration-500 group-hover:border-[#5c8d37]/50 group-hover:shadow-[#5c8d37]/20">
                                        <img
                                            src={resolveImageUrl(product.images[0])}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />


                                        {/* Stock Badge */}
                                        {product.stock < 10 && product.stock > 0 && (
                                            <motion.div
                                                initial={{ scale: 0, rotate: -180 }}
                                                whileInView={{ scale: 1, rotate: 0 }}
                                                transition={{ delay: index * 0.12 + 0.3, type: "spring", bounce: 0.7 }}
                                                animate={{ scale: [1, 1.1, 1] }}
                                                className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                                            >
                                                Only {product.stock} left
                                            </motion.div>
                                        )}
                                        {product.stock === 0 && (
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                whileInView={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: index * 0.12 + 0.3, type: "spring", bounce: 0.5 }}
                                                className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                                            >
                                                Out of Stock
                                            </motion.div>
                                        )}


                                        {/* Overlay Info */}
                                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                                            <h3 className="text-2xl font-bold text-white mb-2 font-serif">{product.name}</h3>
                                            <p className="text-slate-400 line-clamp-2 mb-4 text-xs">{product.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xl font-black text-[#5c8d37]">₹{product.price}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        addToCart({ ...product, price: product.price, image: resolveImageUrl(product.images[0]), quantity: 1 });
                                                    }}
                                                    disabled={product.stock === 0}
                                                    className="bg-white text-black p-2.5 rounded-full hover:bg-[#5c8d37] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <ShoppingBag size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <p className="text-2xl text-slate-500">No products found in this category</p>
                        </motion.div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full border-t border-white/5 bg-black py-16 text-center">
                <div className="flex flex-col items-center gap-4">
                    <Leaf className="text-[#5c8d37]" size={40} />
                    <h2 className="text-2xl font-serif text-white italic">Village Kitchen</h2>
                    <p className="text-slate-600 font-light">© 2026 Village Kitchen. Rooted in Nature.</p>
                </div>
            </footer>
        </div>
    );
}
