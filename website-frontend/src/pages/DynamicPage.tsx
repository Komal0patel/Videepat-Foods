import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Leaf, ArrowLeft, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface Page {
    _id: string;
    name: string;
    slug: string;
    meta_title: string;
    meta_description: string;
    sections: any[];
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

const API_URL = 'http://localhost:8000/api';

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#0a0d08',
        color: '#f1f5f9',
        fontFamily: "'Outfit', sans-serif",
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
    title: {
        fontSize: 'clamp(32px, 5vw, 56px)',
        fontWeight: 900,
        marginBottom: '60px',
        letterSpacing: '-0.03em',
        color: '#ffffff',
        textAlign: 'center' as const,
        fontFamily: "'Playfair Display', serif",
    },
    storyGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '48px',
        marginBottom: '100px',
    },
    storyCard: {
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        position: 'relative' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        outline: 'none',
    },
    cardImageContainer: {
        width: '100%',
        aspectRatio: '16/10',
        overflow: 'hidden',
        position: 'relative' as const,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
        transition: 'transform 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
    },
    cardContent: {
        padding: '32px',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column' as const,
    },
    cardTitle: {
        fontSize: '24px',
        fontWeight: 800,
        color: '#ffffff',
        marginBottom: '16px',
        lineHeight: 1.3,
        fontFamily: "'Playfair Display', serif",
    },
    cardExcerpt: {
        fontSize: '16px',
        color: '#94a3b8',
        lineHeight: 1.7,
        marginBottom: '28px',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden',
        flexGrow: 1,
    },
    detailOverlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0d08',
        zIndex: 1000,
        overflowY: 'auto' as const,
    },
    detailHero: {
        width: '100%',
        height: '80vh',
        position: 'relative' as const,
        overflow: 'hidden',
    },
    detailHeroImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
    },
    detailHeroOverlay: {
        position: 'absolute' as const,
        inset: 0,
        background: 'linear-gradient(to top, #0a0d08 0%, rgba(10, 13, 8, 0.4) 50%, transparent 100%)',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '80px 24px',
    },
    detailCloseBtn: {
        position: 'fixed' as const,
        top: '32px',
        right: '32px',
        padding: '12px 24px',
        borderRadius: '100px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#ffffff',
        cursor: 'pointer',
        zIndex: 1100,
        fontWeight: 700,
        fontSize: '14px',
        textTransform: 'uppercase' as const,
        letterSpacing: '1px',
        transition: 'all 0.3s ease',
    }
};

export default function DynamicPage() {
    const { slug } = useParams();
    const [page, setPage] = useState<Page | null>(null);
    const [stories, setStories] = useState<Story[]>([]);
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

    const isStoryPage = slug?.toLowerCase().trim() === 'story' || slug?.toLowerCase().trim() === 'our-village-story';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pagesRes, storyRes] = await Promise.all([
                    fetch(`${API_URL}/pages/`),
                    fetch(`${API_URL}/stories/`)
                ]);
                const pagesData = await pagesRes.json();
                const storiesData = await storyRes.json();

                const normalizedSlug = slug?.toLowerCase().trim();
                const foundPage = pagesData.find((p: Page) => p.slug?.toLowerCase().trim() === normalizedSlug);

                setPage(foundPage || null);
                setStories(storiesData.filter((s: Story) => s.is_active));
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err);
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    useEffect(() => {
        if (selectedStory) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [selectedStory]);

    if (loading) {
        return (
            <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Leaf color="#5c8d37" size={64} />
                </motion.div>
            </div>
        );
    }

    if (!page) {
        return (
            <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px' }}>Harvest Not Found</h1>
                    <Link to="/" style={{ color: '#5c8d37', textDecoration: 'none', fontWeight: 800 }}>Return to Kitchen</Link>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} style={{ ...styles.page, position: 'relative', overflow: 'hidden' }}>

            {/* Fixed Background with Parallax - Only for Story Page */}
            {isStoryPage && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                    <motion.div style={{ scale, y: yBg, width: '100%', height: '100%' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10, 13, 8, 0.85)', zIndex: 10 }} />
                        <img
                            src="/assets/stories-bg.jpg"
                            alt="Village Kitchen"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2670&auto=format&fit=crop'}
                        />
                    </motion.div>
                </div>
            )}

            <header style={{ ...styles.header, position: 'sticky', zIndex: 100 }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <motion.div whileHover={{ rotate: -15 }}>
                            <ArrowLeft color="#ffffff" size={24} />
                        </motion.div>
                        <span style={{ color: '#ffffff', fontWeight: 700 }}>Village kitchen</span>
                    </Link>
                    <Leaf color="#5c8d37" size={32} />
                </div>
            </header>

            <div style={{ paddingTop: '120px', position: 'relative', zIndex: 10 }}>
                <style>{`
                    .story-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 48px;
                    }
                    @media (max-width: 1024px) {
                        .story-grid {
                            gap: 32px;
                        }
                    }
                    @media (max-width: 768px) {
                        .story-grid {
                            grid-template-columns: repeat(2, 1fr);
                            gap: 24px;
                        }
                    }
                    @media (max-width: 640px) {
                        .story-grid {
                            grid-template-columns: 1fr;
                            gap: 32px;
                        }
                    }
                    .story-card:hover .hover-zoom {
                        transform: scale(1.08);
                    }
                    .story-card:focus-visible {
                        border-color: #5c8d37;
                        box-shadow: 0 0 0 4px rgba(92, 141, 55, 0.2);
                    }
                `}</style>
                <div style={styles.container}>
                    <motion.h1
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                        style={styles.title}
                    >
                        {page.name}
                    </motion.h1>

                    {isStoryPage && stories.length > 0 ? (
                        <div className="story-grid">
                            {stories.map((story, index) => (
                                <motion.div
                                    key={story._id}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`Read story: ${story.title}`}
                                    initial={{ opacity: 0, y: 100, scale: 0.8, rotateX: 15 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{
                                        type: "spring",
                                        damping: 25,
                                        stiffness: 80,
                                        delay: index * 0.15,
                                        duration: 0.8
                                    }}
                                    style={{ ...styles.storyCard, transformStyle: 'preserve-3d', perspective: 1000 }}
                                    whileHover={{
                                        y: -20,
                                        scale: 1.02,
                                        rotateY: 2,
                                        boxShadow: '0 40px 80px rgba(92, 141, 55, 0.3)',
                                        borderColor: 'rgba(92, 141, 55, 0.6)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.06)'
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedStory(story)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setSelectedStory(story);
                                        }
                                    }}
                                    className="story-card"
                                >
                                    <div style={styles.cardImageContainer}>
                                        <img
                                            src={story.thumbnailImage}
                                            alt={story.title}
                                            style={styles.cardImage}
                                            className="hover-zoom"
                                            loading="lazy"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                            transition={{ delay: index * 0.15 + 0.3, type: "spring", bounce: 0.5 }}
                                            style={{
                                                position: 'absolute', top: '24px', left: '24px',
                                                background: 'rgba(92, 141, 55, 0.9)',
                                                backdropFilter: 'blur(4px)',
                                                color: 'white', padding: '6px 16px',
                                                borderRadius: '50px', fontSize: '11px', fontWeight: 900,
                                                letterSpacing: '1.5px', textTransform: 'uppercase',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                            }}
                                        >
                                            VILLAGE STORY
                                        </motion.div>
                                    </div>
                                    <div style={styles.cardContent}>
                                        <h2 style={styles.cardTitle}>{story.title}</h2>
                                        <p style={styles.cardExcerpt}>{story.shortExcerpt}</p>
                                        <div style={{
                                            marginTop: 'auto',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            color: '#5c8d37',
                                            fontWeight: 800,
                                            fontSize: '14px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}>
                                            Explore Story <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ marginBottom: '80px' }}>
                            {page.sections?.map((section, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 60, scale: 0.95 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.6, delay: index * 0.2, type: "spring", bounce: 0.3 }}
                                    whileHover={{ scale: 1.01, boxShadow: '0 20px 40px rgba(92, 141, 55, 0.1)' }}
                                    style={{ background: 'rgba(255,255,255,0.02)', padding: '64px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '32px' }}
                                >
                                    {section.blocks?.map((block: any, bIndex: number) => (
                                        <motion.div
                                            key={bIndex}
                                            initial={{ opacity: 0, x: -30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: bIndex * 0.1, duration: 0.5 }}
                                            style={{ marginBottom: bIndex === section.blocks.length - 1 ? 0 : '40px' }}
                                        >
                                            {block.type === 'text' && (
                                                <div style={{ maxWidth: '800px', margin: block.content?.alignment === 'center' ? '0 auto' : block.content?.alignment === 'right' ? '0 0 0 auto' : '0', textAlign: block.content?.alignment || 'left' }}>
                                                    {block.content.heading && (
                                                        <motion.h2
                                                            initial={{ opacity: 0, y: 20 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            viewport={{ once: true }}
                                                            transition={{ delay: 0.2 }}
                                                            style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', marginBottom: '24px' }}
                                                        >
                                                            {block.content.heading}
                                                        </motion.h2>
                                                    )}
                                                    {block.content.body && (
                                                        <motion.p
                                                            initial={{ opacity: 0 }}
                                                            whileInView={{ opacity: 1 }}
                                                            viewport={{ once: true }}
                                                            transition={{ delay: 0.3 }}
                                                            style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.8 }}
                                                        >
                                                            {block.content.body}
                                                        </motion.p>
                                                    )}
                                                </div>
                                            )}

                                            {block.type === 'image' && block.content?.url && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    viewport={{ once: true }}
                                                    whileHover={{ scale: 1.02 }}
                                                    transition={{ duration: 0.5 }}
                                                    style={{ marginTop: '24px', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}
                                                >
                                                    <img
                                                        src={block.content.url}
                                                        alt={block.content.caption || 'Image'}
                                                        style={{ width: '100%', height: 'auto', display: 'block' }}
                                                        loading="lazy"
                                                    />
                                                    {block.content.caption && (
                                                        <p style={{ marginTop: '12px', fontSize: '14px', color: '#94a3b8', fontStyle: 'italic', padding: '0 16px 16px' }}>
                                                            {block.content.caption}
                                                        </p>
                                                    )}
                                                </motion.div>
                                            )}

                                            {block.type === 'video' && block.content?.url && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 30 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.6 }}
                                                    style={{ marginTop: '24px', borderRadius: '24px', overflow: 'hidden', aspectRatio: '16/9', position: 'relative', border: '1px solid rgba(255,255,255,0.05)' }}
                                                >
                                                    {block.content.url.includes('youtube') || block.content.url.includes('youtu.be') ? (
                                                        <iframe
                                                            src={block.content.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        />
                                                    ) : (
                                                        <video
                                                            src={block.content.url}
                                                            controls
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    )}
                                                </motion.div>
                                            )}

                                            {block.type === 'button' && block.content && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ type: "spring", bounce: 0.5 }}
                                                    style={{ marginTop: '24px', textAlign: block.content.alignment || 'left' }}
                                                >
                                                    <motion.a
                                                        href={block.content.link || '#'}
                                                        whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(92, 141, 55, 0.4)' }}
                                                        whileTap={{ scale: 0.95 }}
                                                        style={{
                                                            display: 'inline-block',
                                                            padding: '16px 32px',
                                                            backgroundColor: '#5c8d37',
                                                            color: '#ffffff',
                                                            borderRadius: '100px',
                                                            textDecoration: 'none',
                                                            fontWeight: 800,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '1px',
                                                            boxShadow: '0 10px 20px rgba(92, 141, 55, 0.2)'
                                                        }}
                                                    >
                                                        {block.content.text || 'Click Here'}
                                                    </motion.a>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedStory && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        style={styles.detailOverlay}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                            whileTap={{ scale: 0.95 }}
                            style={styles.detailCloseBtn}
                            onClick={() => setSelectedStory(null)}
                        >
                            <X size={20} /> CLOSE
                        </motion.button>

                        <div style={styles.detailHero}>
                            <motion.img
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                src={selectedStory.heroImage}
                                alt={selectedStory.title}
                                style={styles.detailHeroImage}
                            />
                            <div style={styles.detailHeroOverlay}>
                                <div style={{ width: '100%', padding: '0 48px' }}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.6 }}
                                    >
                                        {selectedStory.subtitle && (
                                            <span style={{
                                                color: '#5c8d37',
                                                fontWeight: 900,
                                                textTransform: 'uppercase',
                                                letterSpacing: '4px',
                                                fontSize: '14px',
                                                marginBottom: '16px',
                                                display: 'block'
                                            }}>
                                                {selectedStory.subtitle}
                                            </span>
                                        )}
                                        <h1 style={{
                                            fontSize: 'clamp(40px, 8vw, 72px)',
                                            fontWeight: 900,
                                            color: '#ffffff',
                                            margin: 0,
                                            lineHeight: 1.1,
                                            fontFamily: "'Playfair Display', serif"
                                        }}>
                                            {selectedStory.title}
                                        </h1>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '80px 48px' }}>
                            <div style={{ position: 'relative' }}>
                                {selectedStory.fullStoryContent.map((block, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{
                                            duration: 0.8,
                                            ease: [0.23, 1, 0.32, 1],
                                            delay: idx * 0.1
                                        }}
                                        style={{
                                            marginBottom: '40px',
                                            float: (block.type === 'image' || block.type === 'video') ? 'left' : 'none',
                                            width: (block.type === 'image' || block.type === 'video') ? '35%' : 'auto',
                                            marginRight: (block.type === 'image' || block.type === 'video') ? '48px' : '0',
                                            clear: (block.type === 'heading' || block.type === 'subheading') ? 'both' : 'none',
                                        }}
                                    >
                                        {block.type === 'heading' && (
                                            <h2 style={{
                                                fontSize: '36px',
                                                fontWeight: 900,
                                                color: '#ffffff',
                                                marginBottom: '32px',
                                                fontFamily: "'Playfair Display', serif"
                                            }}>
                                                {block.content}
                                            </h2>
                                        )}

                                        {block.type === 'subheading' && (
                                            <h3 style={{
                                                fontSize: '24px',
                                                fontWeight: 700,
                                                color: '#5c8d37',
                                                marginBottom: '20px',
                                                fontFamily: "'Outfit', sans-serif"
                                            }}>
                                                {block.content}
                                            </h3>
                                        )}

                                        {block.type === 'text' && (
                                            <div style={{
                                                fontSize: '20px',
                                                color: '#cbd5e1',
                                                lineHeight: 1.8,
                                                fontWeight: 400,
                                                whiteSpace: 'pre-wrap'
                                            }}>
                                                {block.content}
                                            </div>
                                        )}

                                        {(block.type === 'image' || block.type === 'video') && (
                                            <div style={{
                                                borderRadius: '20px',
                                                overflow: 'hidden',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                                margin: 0
                                            }}>
                                                {block.type === 'image' ? (
                                                    <img
                                                        src={block.url}
                                                        alt={block.caption || 'Story detail image'}
                                                        style={{ width: '100%', height: 'auto', display: 'block' }}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                                                        <iframe
                                                            src={block.url?.replace('watch?v=', 'embed/')}
                                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        ></iframe>
                                                    </div>
                                                )}
                                                {block.caption && (
                                                    <div style={{
                                                        padding: '24px',
                                                        background: 'rgba(255,255,255,0.02)',
                                                        color: '#94a3b8',
                                                        fontStyle: 'italic',
                                                        fontSize: '15px',
                                                        fontWeight: 500,
                                                        textAlign: 'left',
                                                        borderTop: '1px solid rgba(255,255,255,0.05)'
                                                    }}>
                                                        — {block.caption}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                                <div style={{ clear: 'both' }} />
                            </div>

                            <div style={{ marginTop: '100px', textAlign: 'left' }}>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedStory(null)}
                                    style={{
                                        padding: '24px 56px',
                                        borderRadius: '100px',
                                        background: 'linear-gradient(135deg, #5c8d37 0%, #3e5e25 100%)',
                                        color: '#ffffff',
                                        fontWeight: 800,
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        fontSize: '16px',
                                        letterSpacing: '1px',
                                        textTransform: 'uppercase',
                                        boxShadow: '0 20px 40px rgba(92, 141, 55, 0.3)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <ArrowLeft size={20} /> Return to Stories
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <footer style={{ padding: '80px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ color: '#475569', fontSize: '14px' }}>&copy; 2024 Village Kitchen. Authenticity in every grain.</p>
            </footer>
        </div>
    );
}
