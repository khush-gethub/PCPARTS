/*
 * index.js - Application Entry Point
 * 
 * Dependencies:
 * - express
 * - mongoose
 * - cors
 *
 * Updated to support 19-entity schema.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import all models
const {
    User, Address, Category, Brand, Product, ProductVariant, Stock,
    ProductImage, Benchmark, PCBuilderCompatibility, ReadyMadePC,
    ReadyMadePCItem, Coupon, UserCoupon, Cart, CartItem, Order,
    OrderItem, PDFDownload
} = require('./schema');

const app = express();
const PORT = process.env.PORT || 4080;

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect('mongodb://127.0.0.1:27017/pcstore')
    .then(() => console.log('✅ MongoDB Connected to pc_store_db'))
    .catch(err => console.error('❌ Database Connection Error:', err));

// --- Routes ---

// Health Check
app.get('/', (req, res) => {
    res.send({ message: 'PC Store API is running 🚀', endpoints: 'Check /products, /categories, etc.' });
});

// --- GENERIC CRUD HANDLER (Simplified for demonstration) ---
// In a real app, you would separate these into controllers

// 1. Products
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
        // Search by product_id (UUID) not _id
        const product = await Product.findOne({ product_id: req.params.id })
            .populate('category_id')
            .populate('brand_id');
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Categories
app.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Brands
app.get('/brands', async (req, res) => {
    try {
        const brands = await Brand.find();
        res.json(brands);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Product Variants (by Product ID)
app.get('/products/:id/variants', async (req, res) => {
    try {
        const variants = await ProductVariant.find({ product_id: req.params.id });
        res.json(variants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Stock Check
app.get('/stock/:variant_id', async (req, res) => {
    try {
        const stock = await Stock.findOne({ variant_id: req.params.variant_id });
        if (!stock) return res.json({ variant_id: req.params.variant_id, quantity: 0 });
        res.json(stock);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Users (For Testing)
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/users', async (req, res) => {
    
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 7. Orders
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
        // Logic should handle order_items creation too, but keeping it simple
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`Endpoints available: /products, /categories, /brands, /users, /orders`);
});
