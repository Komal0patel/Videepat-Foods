import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const pageService = {
    getPages: () => api.get('/pages/'),
    getPage: (id: string) => api.get(`/pages/${id}/`),
    createPage: (data: any) => api.post('/pages/', data),
    updatePage: (id: string, data: any) => api.put(`/pages/${id}/`, data),
    deletePage: (id: string) => api.delete(`/pages/${id}/`),
};

export const productService = {
    getProducts: () => api.get('/products/'),
    createProduct: (data: any) => api.post('/products/', data),
    updateProduct: (id: string, data: any) => api.put(`/products/${id}/`, data),
    deleteProduct: (id: string) => api.delete(`/products/${id}/`),
};

export const authService = {
    login: (data: any) => api.post('/token/', data),
    refresh: (data: any) => api.post('/token/refresh/', data),
};

export default api;
