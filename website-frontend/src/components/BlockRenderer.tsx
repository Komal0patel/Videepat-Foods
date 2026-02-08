import React from 'react';
import { motion } from 'framer-motion';
import { Block } from '../types';
import { cn } from '../utils/cn';

const BlockRenderer: React.FC<{ block: Block }> = ({ block }) => {
    const { type, content, styles, animations, visibility } = block;

    // Simple visibility check
    // In a real app, you'd use a hook for screen size
    const isVisible = true;

    if (!isVisible) return null;

    const animationProps = animations.type === 'fade' ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        transition: { duration: 0.5, delay: animations.delay || 0 }
    } : {};

    switch (type) {
        case 'text':
            return (
                <motion.div {...animationProps} className={cn("space-y-4", styles.textAlign === 'center' ? 'text-center' : '')}>
                    {content.heading && <h2 className="text-4xl md:text-6xl font-black text-white">{content.heading}</h2>}
                    {content.body && <p className="text-lg text-slate-400 max-w-2xl mx-auto">{content.body}</p>}
                </motion.div>
            );

        case 'image':
            return (
                <motion.div {...animationProps} className="rounded-3xl overflow-hidden shadow-2xl">
                    <img src={content.url} alt={content.alt || ''} className="w-full h-auto" />
                </motion.div>
            );

        case 'button':
            return (
                <motion.button
                    {...animationProps}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl shadow-xl shadow-primary-500/20"
                >
                    {content.text}
                </motion.button>
            );

        default:
            return null;
    }
};

export default BlockRenderer;
