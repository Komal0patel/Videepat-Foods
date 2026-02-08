import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, Page, Coupon, Category, Story } from '../types';
import api from '../services/api';

interface StoreContextType {
    products: Product[];
    pages: Page[];
    coupons: Coupon[];
    categories: Category[];
    stories: Story[];
    addProduct: (product: Product) => void;
    updateProduct: (id: string, product: Product) => void;
    deleteProduct: (id: string) => void;
    addPage: (page: Page) => void;
    updatePage: (id: string, page: Page) => void;
    deletePage: (id: string) => void;
    addCoupon: (coupon: Coupon) => void;
    updateCoupon: (id: string, coupon: Coupon) => void;
    deleteCoupon: (id: string) => void;
    addCategory: (category: Partial<Category>) => void;
    deleteCategory: (id: string) => void;
    addStory: (story: Story) => void;
    updateStory: (id: string, story: Story) => void;
    deleteStory: (id: string) => void;
    loading: boolean;
    error: string | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [pages, setPages] = useState<Page[]>([]);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [prodRes, pageRes, coupRes, catRes, storyRes] = await Promise.all([
                api.get('/products/'),
                api.get('/pages/'),
                api.get('/coupons/'),
                api.get('/categories/'),
                api.get('/stories/')
            ]);

            setProducts(prodRes.data);
            setPages(pageRes.data);
            setCoupons(coupRes.data);
            setCategories(catRes.data);
            setStories(storyRes.data);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.response?.data?.message || err.message || 'Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Optional: Poll for updates or use sockets in future
    }, []);

    // Products
    const addProduct = async (product: Product) => {
        try {
            const res = await api.post('/products/', product);
            setProducts([...products, res.data]);
        } catch (err: any) {
            console.error(err);
            throw err.response?.data?.error || err.response?.data?.message || err.message;
        }
    };

    const updateProduct = async (id: string, product: Product) => {
        try {
            const res = await api.put(`/products/${id}/`, product);
            setProducts(products.map((p: Product) => (p.id === id || p._id === id) ? res.data : p));
        } catch (err: any) {
            console.error(err);
            throw err.response?.data?.error || err.response?.data?.message || err.message;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            await api.delete(`/products/${id}/`);
            setProducts(products.filter((p: Product) => (p.id !== id && p._id !== id)));
        } catch (err) { console.error(err); }
    };

    // Pages
    const addPage = async (page: Page) => {
        try {
            const res = await api.post('/pages/', page);
            setPages([...pages, res.data]);
            return res.data;
        } catch (err: any) {
            console.error(err);
            throw err.response?.data?.error || err.response?.data?.message || err.message;
        }
    };

    const updatePage = async (id: string, page: Page) => {
        try {
            const res = await api.put(`/pages/${id}/`, page);
            setPages(pages.map((p: Page) => (p.id === id || p._id === id) ? res.data : p));
            return res.data;
        } catch (err: any) {
            console.error(err);
            throw err.response?.data?.error || err.response?.data?.message || err.message;
        }
    };

    const deletePage = async (id: string) => {
        try {
            await api.delete(`/pages/${id}/`);
            setPages(pages.filter((p: Page) => (p.id !== id && p._id !== id)));
        } catch (err) { console.error(err); }
    };

    // Coupons
    const addCoupon = async (coupon: Coupon) => {
        try {
            const res = await api.post('/coupons/', coupon);
            setCoupons([...coupons, res.data]);
        } catch (err) { console.error(err); }
    };

    const updateCoupon = async (id: string, coupon: Coupon) => {
        try {
            const res = await api.put(`/coupons/${id}/`, coupon);
            setCoupons(coupons.map((c: Coupon) => (c.id === id || c._id === id) ? res.data : c));
        } catch (err) { console.error(err); }
    };

    const deleteCoupon = async (id: string) => {
        try {
            await api.delete(`/coupons/${id}/`);
            setCoupons(coupons.filter((c: Coupon) => (c.id !== id && c._id !== id)));
        } catch (err) { console.error(err); }
    };

    // Categories
    const addCategory = async (category: Partial<Category>) => {
        try {
            const res = await api.post('/categories/', category);
            setCategories([...categories, res.data]);
        } catch (err) { console.error(err); }
    };

    const deleteCategory = async (id: string) => {
        try {
            await api.delete(`/categories/${id}/`);
            setCategories(categories.filter((c: Category) => (c.id !== id && c._id !== id)));
        } catch (err) { console.error(err); }
    };

    // Stories
    const addStory = async (story: Story) => {
        try {
            const res = await api.post('/stories/', story);
            setStories([...stories, res.data]);
            return res.data;
        } catch (err: any) {
            console.error(err);
            throw err.response?.data?.message || err.message;
        }
    };

    const updateStory = async (id: string, story: Story) => {
        try {
            const res = await api.put(`/stories/${id}/`, story);
            setStories(stories.map((s: Story) => (s.id === id || s._id === id) ? res.data : s));
            return res.data;
        } catch (err: any) {
            console.error(err);
            throw err.response?.data?.message || err.message;
        }
    };

    const deleteStory = async (id: string) => {
        try {
            await api.delete(`/stories/${id}/`);
            setStories(stories.filter((s: Story) => (s.id !== id && s._id !== id)));
        } catch (err) { console.error(err); }
    };

    return (
        <StoreContext.Provider value={{
            products, pages, coupons, categories, stories,
            addProduct, updateProduct, deleteProduct,
            addPage, updatePage, deletePage,
            addCoupon, updateCoupon, deleteCoupon,
            addCategory, deleteCategory,
            addStory, updateStory, deleteStory,
            loading, error
        }}>
            {children}
        </StoreContext.Provider>
    );
};
