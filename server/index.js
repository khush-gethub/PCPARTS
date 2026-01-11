/*
 * index.js - Application Entry Point
 * 
 * Dependencies:
 * - express
 * - mongoose
 * - cors
 *
 * Updated to support 19-entity schema and 'pcparts' DB.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import all models
const {
    User, Address, Category, Brand, Product, ProductVariant, Stock,
    ProductImage, Benchmark, BenchmarkTable, PCBuilderCompatibility, ReadyMadePC,
    ReadyMadePCItem, Coupon, UserCoupon, Cart, CartItem, Order,
    OrderItem, PDFDownload
} = require('./schema');

const app = express();
const PORT = process.env.PORT || 4080;

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect('mongodb://127.0.0.1:27017/pcparts')
    .then(() => console.log('✅ MongoDB Connected to pcparts'))
    .catch(err => console.error('❌ Database Connection Error:', err));

// --- Routes ---

// Health Check
app.get('/', (req, res) => {
    res.send({ message: 'PC Store API is running 🚀', endpoints: 'Check /products, /categories, etc.' });
});

// Helper for simple GET all
const createGetAllRoute = (path, Model) => {
    app.get(path, async (req, res) => {
        try {
            const items = await Model.find();
            res.json(items);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
};

// 1. Users
createGetAllRoute('/users', User);
app.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 2. Addresses
createGetAllRoute('/addresses', Address);

// 3. Categories
createGetAllRoute('/categories', Category);

// 4. Brands
createGetAllRoute('/brands', Brand);

// 5. Products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category_id', 'name')
            .populate('brand_id', 'name');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id })
            .populate('category_id')
            .populate('brand_id');
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. ProductVariants
app.get('/products/:id/variants', async (req, res) => {
    try {
        const variants = await ProductVariant.find({ product_id: req.params.id });
        res.json(variants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
createGetAllRoute('/variants', ProductVariant);
app.put('/variants/:id', async (req, res) => {
    try {
        const updated = await ProductVariant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 7. Stock
app.get('/stock/:variant_id', async (req, res) => {
    try {
        const stock = await Stock.findOne({ variant_id: req.params.variant_id });
        if (!stock) return res.json({ variant_id: req.params.variant_id, quantity: 0 });
        res.json(stock);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 8. ProductImages
app.get('/products/:id/images', async (req, res) => {
    try {
        const images = await ProductImage.find({ product_id: req.params.id }).sort('position');
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
createGetAllRoute('/product-images', ProductImage);

// 9. Benchmarks
app.get('/benchmarks', async (req, res) => {
    try {
        const benchmarks = await Benchmark.find().populate('product_id');
        res.json(benchmarks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/benchmark-table', async (req, res) => {
    try {
        const data = await BenchmarkTable.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/benchmarks', async (req, res) => {
    try {
        const newBench = new Benchmark(req.body);
        await newBench.save();
        res.status(201).json(newBench);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
app.get('/products/:id/benchmarks', async (req, res) => {
    try {
        const benchmarks = await Benchmark.find({ product_id: req.params.id });
        res.json(benchmarks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 10. PCBuilderCompatibility
createGetAllRoute('/compatibility', PCBuilderCompatibility);

// 11. ReadyMadePC
createGetAllRoute('/readymade-pcs', ReadyMadePC);
app.get('/readymade-pcs/:id', async (req, res) => {
    try {
        const pc = await ReadyMadePC.findOne({ _id: req.params.id });
        if (!pc) return res.status(404).json({ error: 'PC not found' });

        // Get items with deep population
        const itemsData = await ReadyMadePCItem.find({ pc_id: req.params.id })
            .populate({
                path: 'product_id',
                populate: [
                    { path: 'category_id', select: 'name' },
                    { path: 'brand_id', select: 'name' }
                ]
            })
            .populate('variant_id');

        // Fetch stock for each item manually (or we could use aggregate if preferred, but this is simpler for now)
        const itemsWithStock = await Promise.all(itemsData.map(async (item) => {
            const stock = await Stock.findOne({ variant_id: item.variant_id?._id });
            return {
                ...item.toObject(),
                stock: stock ? stock.quantity : 0
            };
        }));

        res.json({ ...pc.toObject(), items: itemsWithStock });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 12. Coupons
createGetAllRoute('/coupons', Coupon);

// 13. UserCoupons
createGetAllRoute('/user-coupons', UserCoupon);

// 14. Cart
app.get('/cart/:user_id', async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.params.user_id });
        if (!cart) return res.status(404).json({ message: 'No cart found' });

        const items = await CartItem.find({ cart_id: cart.cart_id });
        res.json({ ...cart.toObject(), items });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 15. Orders
app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('user_id', 'name email');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 16. PDFDownloads
createGetAllRoute('/pdfs', PDFDownload);

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`Endpoints available for all 19 entities. Check /products, /readymade-pcs, etc.`);
});
