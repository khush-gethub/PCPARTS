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
mongoose.connect('mongodb://127.0.0.1:27017/Pcpart')
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
        // Fetch primary images for all products in parallel
        // Use suffix-based matching as IDs use different prefixes (prod_0_ vs prod_1_ etc)
        const productsWithImages = await Promise.all(products.map(async (p) => {
            const productSuffix = p._id.split('_').pop();

            const image = await ProductImage.findOne({
                product_id: { $regex: productSuffix + '$' }
            }).sort('position');

            return {
                ...p.toObject(),
                image_url: image ? image.image_url : null
            };
        }));

        res.json(productsWithImages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Enhanced Get Single Product with Aggregation
app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category_id')
            .populate('brand_id');

        if (!product) return res.status(404).json({ error: 'Product not found' });

        // Parallel fetch for related data
        const productSuffix = req.params.id.split('_').pop();

        const [variants, images, benchmarks] = await Promise.all([
            ProductVariant.find({ product_id: req.params.id }),
            ProductImage.find({
                product_id: { $regex: productSuffix + '$' }
            }).sort('position'),
            Benchmark.find({ product_id: req.params.id })
        ]);

        // Construct response object
        const responseData = {
            ...product.toObject(),
            variants,
            images,
            benchmarks
        };

        res.json(responseData);
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

// 9. Benchmarks
// 9. Benchmarks
createGetAllRoute('/benchmarks', Benchmark);
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
        const pc = await ReadyMadePC.findById(req.params.id);
        if (!pc) return res.status(404).json({ error: 'PC not found' });

        // Get items and populate details
        const items = await ReadyMadePCItem.find({ pc_id: req.params.id })
            .populate('product_id', 'name specs')
            .populate('variant_id', 'price');

        // Construct detailed response
        // Note: ReadyMadePC schema has image fields directly, but if we had a separate gallery table we'd fetch it here.
        // We will format the images array from the flat fields
        const images = [];
        if (pc.image) images.push(pc.image);
        if (pc.Image2) images.push(pc.Image2);
        if (pc.Image3) images.push(pc.Image3);

        res.json({
            ...pc.toObject(),
            items,
            images // Explicitly sending as an array for the gallery
        });
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

// 20. Unified Search
app.get('/search', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.json({ results: [], query: '' });

    const regex = new RegExp(q, 'i');

    try {
        // Search Products with Category & Brand names
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category_id',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brand_id',
                    foreignField: '_id',
                    as: 'brand'
                }
            },
            { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },
            {
                $match: {
                    $or: [
                        { name: regex },
                        { description: regex },
                        { 'category.name': regex },
                        { 'brand.name': regex }
                    ]
                }
            },
            { $limit: 40 }
        ]);

        // Enrich products with primary image and basic variant for price
        const enrichedProducts = await Promise.all(products.map(async (p) => {
            const [image, variant] = await Promise.all([
                ProductImage.findOne({ product_id: p._id }).sort('position'),
                ProductVariant.findOne({ product_id: p._id })
            ]);
            return {
                ...p,
                image_url: image ? image.image_url : null,
                price: variant ? variant.price : (p.price || 0),
                type: 'product'
            };
        }));

        // Search ReadyMadePCs
        const pcs = await ReadyMadePC.find({
            $or: [
                { name: regex },
                { category: regex }
            ]
        }).limit(20);

        const enrichedPCs = pcs.map(pc => ({
            ...pc.toObject(),
            type: 'readymade-pc'
        }));

        res.json({
            results: [...enrichedProducts, ...enrichedPCs],
            query: q
        });
    } catch (err) {
        console.error("Search error:", err);
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
