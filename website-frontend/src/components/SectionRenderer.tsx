import React from 'react';
import { Section } from '../types';
import BlockRenderer from './BlockRenderer';
import { cn } from '../utils/cn';

const SectionRenderer: React.FC<{ section: Section }> = ({ section }) => {
    const { layout, styles, blocks } = section;

    return (
        <section
            style={{
                backgroundColor: styles.backgroundColor,
                padding: styles.padding,
                backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            className={cn(
                "relative",
                layout === 'full' ? 'w-full' : 'max-w-7xl mx-auto px-6'
            )}
        >
            <div className={cn(
                "grid gap-8",
                layout === 'split' ? 'md:grid-cols-2' : 'grid-cols-1'
            )}>
                {blocks.map(block => (
                    <BlockRenderer key={block.id} block={block} />
                ))}
            </div>
        </section>
    );
};

export default SectionRenderer;
