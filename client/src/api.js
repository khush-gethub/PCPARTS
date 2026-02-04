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
    createReadyMadePC: (data) => fetchJson('/readymade-pcs', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateReadyMadePC: (id, data) => fetchJson(`/readymade-pcs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    deleteReadyMadePC: (id) => fetchJson(`/readymade-pcs/${id}`, {
        method: 'DELETE'
    }),
    addReadyMadePCItem: (pcId, data) => fetchJson(`/readymade-pcs/${pcId}/items`, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    removeReadyMadePCItem: (itemId) => fetchJson(`/readymade-pcs/items/${itemId}`, {
        method: 'DELETE'
    }),

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

    // Auth
    register: (userData) => fetchJson('/api/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
    login: (credentials) => fetchJson('/api/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),

    // Addresses
    getAddressesByUserId: (userId) => fetchJson(`/api/addresses/${userId}`),
    addAddress: (addressData) => fetchJson('/api/addresses', {
        method: 'POST',
        body: JSON.stringify(addressData),
    }),
    updateAddress: (id, addressData) => fetchJson(`/api/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(addressData),
    }),
    deleteAddress: (id) => fetchJson(`/api/addresses/${id}`, {
        method: 'DELETE',
    }),

    // Orders (User Specific)
    getOrdersByUserId: (userId) => fetchJson(`/api/orders/user/${userId}`),
};
