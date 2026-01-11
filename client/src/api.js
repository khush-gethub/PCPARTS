import axios from 'axios';

const API_BASE_URL = 'http://localhost:4080';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const api = {
    // Products
    getProducts: async () => {
        const response = await apiClient.get('/products');
        return response.data;
    },
    getProductById: async (id) => {
        // Just return the data, error handling is done in the component
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    },

    // Ready-Made PCs
    getReadyMadePCs: async () => {
        const response = await apiClient.get('/readymade-pcs');
        return response.data;
    },
    getReadyMadePCById: async (id) => {
        const response = await apiClient.get(`/readymade-pcs/${id}`);
        return response.data;
    },

    // Categories & Brands
    getCategories: async () => {
        const response = await apiClient.get('/categories');
        return response.data;
    },
    getBrands: async () => {
        const response = await apiClient.get('/brands');
        return response.data;
    },

    // Variants & Stock
    getVariants: async () => {
        // Optimally, we should probably fetch variants by product ID, but keeping generic for now matching index.js
        const response = await apiClient.get('/variants');
        return response.data;
    },
    getVariantsByProductId: async (productId) => {
        const response = await apiClient.get(`/products/${productId}/variants`);
        return response.data;
    },

    // Images
    getProductImages: async (productId) => {
        const response = await apiClient.get(`/products/${productId}/images`);
        return response.data;
    },

    // Benchmarks
    getBenchmarks: async () => {
        const response = await apiClient.get('/benchmarks');
        return response.data;
    },
    getProductBenchmarks: async (productId) => {
        const response = await apiClient.get(`/products/${productId}/benchmarks`);
        return response.data;
    },

    // Search
    search: async (query) => {
        const response = await apiClient.get(`/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    // Cart
    getCart: async (userId) => {
        const response = await apiClient.get(`/cart/${userId}`);
        return response.data;
    },
    addToCart: async (userId, item) => {
        // Placeholder for future POST implementation matching backend
        // const response = await apiClient.post(`/cart/${userId}/items`, item);
        // return response.data;
        console.warn("addToCart API not fully implemented on backend yet");
        return Promise.resolve({});
    }
};
