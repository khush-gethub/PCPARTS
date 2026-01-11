const BASE_URL = 'http://localhost:4080';

const fetchJson = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
};

export const api = {
    // Products
    getProducts: () => fetchJson('/products'),
    getProductById: (id) => fetchJson(`/products/${id}`),
    getProductsByCategory: (categoryId) => fetchJson(`/products?category=${categoryId}`), // Simplified, backend might need adjustment if filtering logic exists
    getVariants: () => fetchJson('/variants'),
    getVariantsByProductId: (productId) => fetchJson(`/products/${productId}/variants`),

    // Categories & Brands
    getCategories: () => fetchJson('/categories'),
    getBrands: () => fetchJson('/brands'),

    // Benchmarks
    getBenchmarks: () => fetchJson('/benchmarks'),
    getBenchmarkTable: () => fetchJson('/benchmark-table'),
    getProductBenchmarks: (productId) => fetchJson(`/products/${productId}/benchmarks`),

    // ReadyMade PCs
    getReadyMadePCs: () => fetchJson('/readymade-pcs'),
    getReadyMadePCById: (id) => fetchJson(`/readymade-pcs/${id}`),

    // Users & Cart
    getUsers: () => fetchJson('/users'),
    getCart: (userId) => fetchJson(`/cart/${userId}`),

    // Images
    getProductImages: (productId) => fetchJson(`/products/${productId}/images`),
    getAllProductImages: () => fetchJson('/product-images'),

    // Stock
    getStock: (variantId) => fetchJson(`/stock/${variantId}`),

    // Variants (General)
    getAllVariants: () => fetchJson('/variants'),

    // Orders
    createOrder: (orderData) => fetchJson('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
    }),

    // Unified Search
    search: (query) => fetchJson(`/search?q=${encodeURIComponent(query)}`),
};
