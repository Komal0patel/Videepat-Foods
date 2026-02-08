import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, ShoppingBag, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    is_active: boolean;
}

interface Page {
    _id: string;
    name: string;
    slug: string;
    is_active: boolean;
}

interface StoryContent {
    type: 'text' | 'image' | 'video' | 'heading' | 'subheading';
    content?: string;
    url?: string;
    caption?: string;
}

interface Story {
    _id: string;
    title: string;
    subtitle: string;
    thumbnailImage: string;
    heroImage: string;
    shortExcerpt: string;
    fullStoryContent: StoryContent[];
    is_active: boolean;
}

interface Hero {
    _id?: string;
    title: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
}

const API_URL = 'http://localhost:8000/api';

const resolveImageUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    return url;
};

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [pages, setPages] = useState<Page[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [hero, setHero] = useState<Hero>({
        title: 'Fresh from Our Village',
        subtitle: 'Authentic flavors, delivered to your doorstep',
        description: 'Experience the taste of tradition with our handpicked selection of village-fresh products',
        backgroundImage: '/assets/hero.png',
        ctaText: 'Explore Our Products',
        ctaLink: '/products',
        secondaryCtaText: 'Our Story',
        secondaryCtaLink: '/story'
    });
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);
    const { cartCount, setIsCartOpen, addToCart } = useCart();

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // The "Walking" Effect: Zoom into the background
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
    const yParams = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    // Parallax for floating elements
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, pageRes, storyRes, heroRes] = await Promise.all([
                    fetch(`${API_URL}/products/`),
                    fetch(`${API_URL}/pages/`),
                    fetch(`${API_URL}/stories/`),
                    fetch(`${API_URL}/hero/`)
                ]);
                const prodData = await prodRes.json();
                const pageData = await pageRes.json();
                const storyData = await storyRes.json();
                const heroData = await heroRes.json();

                if (Array.isArray(prodData)) setProducts(prodData.filter((p: Product) => p.is_active));
                if (Array.isArray(pageData)) setPages(pageData.filter((p: Page) => p.is_active));
                if (Array.isArray(storyData)) setStories(storyData.filter((s: Story) => s.is_active));
                if (heroData) setHero(heroData);
                setLoading(false);
            } catch (err) {
                console.error('Home fetchData error:', err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
        <div ref={containerRef} className="relative bg-[#0a0d08] text-slate-200 font-sans min-h-[300vh] selection:bg-[#5c8d37] selection:text-white overflow-hidden">

            {/* --- The Walking Path (Global Fixed Background) --- */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div style={{ scale, y: yParams }} className="w-full h-full">
                    {/* Dark overlay for readability */}
                    <div className="absolute inset-0 bg-[#0a0d08]/80 z-10" />
                    {/* This image simulates the 'village path' we are walking down */}
                    <img src={hero.backgroundImage} alt="Village Path" className="w-full h-full object-cover" />
                </motion.div>
            </div>

            {/* --- Fixed Header --- */}
            <header className="fixed top-0 left-0 w-full z-50 py-6 px-8 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
                <Link to="/" className="flex items-center gap-3">
                    <Leaf className="text-[#5c8d37]" size={32} />
                    <span className="text-xl font-black tracking-tight text-white font-serif italic">Village Kitchen</span>
                </Link>
                <nav className="hidden md:flex gap-8">
                    <Link to="/" className="text-xs font-bold text-white hover:text-[#5c8d37] transition-colors uppercase tracking-widest">Home</Link>
                    <Link to="/products" className="text-xs font-bold text-white hover:text-[#5c8d37] transition-colors uppercase tracking-widest">Market</Link>
                    {pages.map(page => (
                        <Link key={page._id} to={`/page/${page.slug}`} className="text-xs font-bold text-white hover:text-[#5c8d37] transition-colors uppercase tracking-widest">{page.name}</Link>
                    ))}
                </nav>
                <div className="flex items-center gap-6">
                    <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                        <ShoppingBag size={24} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#5c8d37] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* --- Content Overlay --- */}
            <main className="relative z-10 flex flex-col items-center">

                {/* 1. Hero: The Gateway */}
                <section className="h-screen w-full flex flex-col items-center justify-center text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="max-w-4xl"
                    >
                        <h2 className="text-[#5c8d37] font-bold tracking-[0.5em] uppercase mb-6 text-sm md:text-base animate-pulse">Welcome Home</h2>
                        <h1 className="text-7xl md:text-[9rem] font-black text-white leading-[0.85] font-serif mb-8 drop-shadow-2xl">
                            {hero.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md mb-8">
                            {hero.subtitle}
                        </p>
                        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-12">
                            {hero.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to={hero.ctaLink}
                                className="px-8 py-4 bg-[#5c8d37] text-white rounded-full font-bold uppercase tracking-widest hover:bg-[#4a7329] transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                {hero.ctaText}
                            </Link>
                            <Link
                                to={hero.secondaryCtaLink}
                                className="px-8 py-4 border-2 border-white text-white rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-[#0a0d08] transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                {hero.secondaryCtaText}
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute bottom-12 text-white/50 flex flex-col items-center gap-2"
                    >
                        <span className="text-[10px] uppercase tracking-widest">Begin Walk</span>
                        <ChevronDown size={24} />
                    </motion.div>
                </section>

                {/* 2. Products: "Looking at Items" on the Walk */}
                <section className="w-full py-40 px-6 max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-20">
                        <div className="h-[2px] w-20 bg-[#5c8d37]" />
                        <span className="text-white font-bold tracking-widest uppercase text-xl">On The Path</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-24 gap-x-12">
                        {products.map((product, index) => (
                            <motion.div
                                key={product._id}
                                style={{ y: index % 2 === 0 ? y1 : y2 }}
                                className={`relative group ${index % 2 !== 0 ? 'md:mt-32' : ''}`}
                            >
                                <div className="aspect-[3/4] relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/20 backdrop-blur-sm shadow-2xl transition-all duration-500 hover:border-[#5c8d37]/50 hover:shadow-[#5c8d37]/20">
                                    <img src={resolveImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                                    {/* Overlay Info */}
                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                                        <h3 className="text-2xl font-bold text-white mb-2 font-serif">{product.name}</h3>
                                        <p className="text-slate-400 line-clamp-2 mb-4 text-xs">{product.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-black text-[#5c8d37]">₹{product.price}</span>
                                            <button
                                                onClick={() => addToCart({ ...product, price: product.price, image: resolveImageUrl(product.images[0]), quantity: 1 })}
                                                className="bg-white text-black px-5 py-2.5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#5c8d37] hover:text-white transition-all"
                                            >
                                                Add to Basket
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-24 relative z-20">
                        <Link to="/products" className="inline-flex items-center gap-3 px-10 py-4 border border-white/20 bg-black/50 backdrop-blur-xl rounded-full text-white text-sm font-bold uppercase tracking-widest hover:bg-[#5c8d37] hover:border-[#5c8d37] transition-all">
                            View All Items <ArrowRight size={16} />
                        </Link>
                    </div>
                </section>

                {/* 3. The Kitchen / Stories: The Destination */}
                <section className="w-full py-32 px-6 bg-gradient-to-b from-transparent to-[#050704] mt-[-10vh]">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="text-center mb-24"
                        >
                            <span className="text-[#5c8d37] font-bold tracking-[0.3em] uppercase text-xs">The Heart of the Village</span>
                            <h2 className="text-5xl md:text-7xl font-black text-white mt-4 font-serif">Stories from the Kitchen</h2>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {stories.map((story, i) => (
                                <motion.div
                                    key={story._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.2 }}
                                    whileHover={{ y: -8 }}
                                    onClick={() => setSelectedStory(story)}
                                    className={`cursor-pointer group relative rounded-2xl overflow-hidden aspect-[3/4] ${i % 3 === 1 ? 'md:mt-12' : i % 3 === 2 ? 'md:mt-24' : ''
                                        }`}
                                >
                                    <img src={resolveImageUrl(story.thumbnailImage)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-all" />
                                    <div className="absolute bottom-0 left-0 p-6 w-full">
                                        <div className="h-[1px] w-full bg-[#5c8d37] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 mb-3" />
                                        <h4 className="text-xl font-bold text-white group-hover:text-[#5c8d37] transition-colors">{story.title}</h4>
                                        <p className="text-slate-400 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">{story.shortExcerpt}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="w-full border-t border-white/5 bg-black py-24 text-center z-20">
                    <div className="flex flex-col items-center gap-6">
                        <Leaf className="text-[#5c8d37]" size={48} />
                        <h2 className="text-3xl font-serif text-white italic">Village Kitchen</h2>
                        <div className="flex gap-8 text-sm font-bold uppercase tracking-widest text-slate-500 mt-4">
                            <Link to="/products" className="hover:text-white transition-colors">Shop</Link>
                            <Link to="/page/about" className="hover:text-white transition-colors">About</Link>
                            <Link to="/page/contact" className="hover:text-white transition-colors">Contact</Link>
                        </div>
                        <p className="text-slate-600 mt-8 font-light">© 2026 Village Kitchen. Rooted in Nature.</p>
                    </div>
                </footer>
            </main>

            {/* Story Detail Overlay */}
            <AnimatePresence>
                {selectedStory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-[#0a0d08] overflow-y-auto"
                    >
                        <button
                            onClick={() => setSelectedStory(null)}
                            className="fixed top-8 right-8 z-50 bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all text-white backdrop-blur-md"
                        >
                            <ArrowRight className="rotate-45" size={24} />
                        </button>
                        <div className="w-full h-[70vh] relative">
                            <img src={resolveImageUrl(selectedStory.heroImage)} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d08] to-transparent flex items-end p-12">
                                <h1 className="text-5xl md:text-8xl font-black text-white max-w-5xl font-serif">{selectedStory.title}</h1>
                            </div>
                        </div>
                        <div className="max-w-3xl mx-auto py-20 px-6">
                            {selectedStory.fullStoryContent.map((block, idx) => (
                                <div key={idx} className="mb-12">
                                    {block.type === 'heading' && <h2 className="text-3xl font-bold text-white mb-6 animate-fade-in-up">{block.content}</h2>}
                                    {block.type === 'text' && <p className="text-xl text-slate-300 leading-relaxed font-light">{block.content}</p>}
                                    {block.type === 'image' && <img src={resolveImageUrl(block.url)} className="w-full rounded-3xl my-8 border border-white/10 shadow-2xl" />}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

