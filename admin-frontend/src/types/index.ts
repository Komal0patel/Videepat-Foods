export type BlockType =
    | 'text'
    | 'image'
    | 'video'
    | 'button'
    | 'product_list'
    | 'offer_banner'
    | 'coupon_block'
    | 'faq'
    | 'testimonial'
    | 'html';

export interface Block {
    id: string;
    _id?: string;
    type: BlockType;
    content: any;
    styles: Record<string, any>;
    animations: Record<string, any>;
    visibility: {
        mobile: boolean;
        tablet: boolean;
        desktop: boolean;
    };
}

export interface Section {
    id: string;
    _id?: string;
    layout: 'full' | 'boxed' | 'split';
    styles: Record<string, any>;
    blocks: Block[];
    order: number;
}

export interface Page {
    id?: string;
    _id?: string;
    name: string;
    slug: string;
    meta_title: string;
    meta_description: string;
    layout: 'default' | 'landing' | 'minimal';
    is_active: boolean;
    status: 'draft' | 'published';
    sections: Section[];
    version: number;
}

export interface Product {
    id?: string;
    _id?: string;
    name: string;
    description: string;
    price: number;
    discount_price?: number;
    stock: number;
    images: string[];
    videos: string[];
    category_ids: string[];
    attributes: Record<string, any>;
    is_active: boolean;
}

export interface Category {
    id?: string;
    _id?: string;
    name: string;
    slug: string;
    description: string;
    media_url: string;
    media_type: 'image' | 'video';
    is_active: boolean;
}

export interface Coupon {
    id?: string;
    _id?: string;
    code: string;
    discount_type: 'percentage' | 'flat';
    discount_value: number;
    min_cart_value: number;
    expiry_date?: string;
    usage_limit?: number;
    usage_count: number;
    is_active: boolean;
    applied_to: {
        type: 'all' | 'products' | 'categories';
        ids: string[];
    };
}

export interface StoryContent {
    id: string;
    type: 'text' | 'image' | 'video' | 'heading' | 'subheading';
    content?: string;
    url?: string;
    caption?: string;
}

export interface Story {
    id?: string;
    _id?: string;
    title: string;
    subtitle: string;
    thumbnailImage: string;
    heroImage: string;
    shortExcerpt: string;
    fullStoryContent: StoryContent[];
    is_active: boolean;
}
