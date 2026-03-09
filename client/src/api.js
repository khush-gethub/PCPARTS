const BASE_URL = 'http://localhost:4080';

const fetchJson = async (endpoint, options = {}) => {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        };

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
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
    // Products
    getProducts: (params = {}) => fetchJson('/products' + (params.category ? `?category=${params.category}` : '')),
    getProductById: (id) => fetchJson(`/products/${id}`),
    createProduct: (data) => fetchJson('/products', { method: 'POST', body: JSON.stringify(data) }),
    updateProduct: (id, data) => fetchJson(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteProduct: (id) => fetchJson(`/products/${id}`, { method: 'DELETE' }),
    getProductsByCategory: (categoryId) => fetchJson(`/products?category=${categoryId}`), // Simplified, backend might need adjustment if filtering logic exists
    getVariants: () => fetchJson('/variants'),
    getVariantsByProductId: (productId) => fetchJson(`/products/${productId}/variants`),

    // Categories & Brands
    getCategories: () => fetchJson('/categories'),
    getBrands: () => fetchJson('/brands'),

    // Benchmarks
    getBenchmarkTable: () => fetchJson('/api/products/benchmark-data'),

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

    // Orders (User Specific & Admin)
    getOrdersByUserId: (userId) => fetchJson(`/api/orders/user/${userId}`),
    getOrderById: (orderId) => fetchJson(`/api/orders/${orderId}`),
    getAllOrders: () => fetchJson('/api/orders'),
    updateOrderStatus: (orderId, status) => fetchJson(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    }),
    updatePaymentStatus: (orderId, status) => fetchJson(`/api/orders/${orderId}/payment-status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    }),

    // Coupons
    getCoupons: () => fetchJson('/api/coupons'),
    createCoupon: (data) => fetchJson('/api/coupons', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateCoupon: (id, data) => fetchJson(`/api/coupons/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    deleteCoupon: (id) => fetchJson(`/api/coupons/${id}`, {
        method: 'DELETE'
    }),
    getUserCoupons: (userId) => fetchJson(`/api/user/coupons/${userId}`),

    // Admin Dashboard
    getAdminStats: () => fetchJson('/api/admin/stats'),
    getAdminRecentOrders: (page = 1, limit = 5) => fetchJson(`/api/admin/recent-orders?page=${page}&limit=${limit}`),
};
