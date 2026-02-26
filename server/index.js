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
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = 'your_super_secret_key_123'; // In production, use environment variables

// Import all models
const {
    User, Address, Category, Brand, Product, ProductVariant, Stock,
    ProductImage, Benchmark, BenchmarkTable, PCBuilderCompatibility, ReadyMadePC,
    ReadyMadePCItem, Coupon, UserCoupon, Cart, CartItem, Order,
    OrderItem, PDFDownload, PCBuild, PCBuildItem
} = require('./schema');

const app = express();
const PORT = process.env.PORT || 4080;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/public/assets', express.static(path.join(__dirname, 'public/assets')));

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

// Registration Route
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validation
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ error: 'All fields are required (name, email, password, phone)' });
        }

        if (phone.length !== 10) {
            return res.status(400).json({ error: 'Phone number must be exactly 10 digits' });
        }

        // Email format validation simple check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Strong password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[*#@!$%&])[A-Za-z\d*#@!$%&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: 'Password must be 8+ chars and include uppercase, lowercase, number, and special character (*#@!$%&)' });
        }

        // Create new user (using plain text password as requested)
        const newUser = new User({
            _id: `user_${uuidv4()}`,
            name,
            email,
            password_: password, // Using password_ field from schema
            phone,
            role: 'user'
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user_id: newUser._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare plain text password
        if (user.password_ !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { user_id: user._id, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Addresses
createGetAllRoute('/addresses', Address);

app.get('/api/addresses/:user_id', async (req, res) => {
    try {
        const addresses = await Address.find({ user_id: req.params.user_id });
        res.json(addresses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/addresses', async (req, res) => {
    try {
        const { user_id, firstName, lastName, line1, line2, city, state, pincode, country, phone } = req.body;
        if (!user_id || !line1 || !city || !state || !pincode || !country) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newAddress = new Address({
            _id: `addr_${uuidv4()}`,
            user_id,
            firstName,
            lastName,
            line1,
            line2,
            city,
            state,
            pincode,
            country,
            phone
        });

        await newAddress.save();
        res.status(201).json(newAddress);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/addresses/:id', async (req, res) => {
    try {
        const { firstName, lastName, line1, line2, city, state, pincode, country, phone } = req.body;
        const updated = await Address.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, line1, line2, city, state, pincode, country, phone },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: 'Address not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/addresses/:id', async (req, res) => {
    try {
        const deleted = await Address.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Address not found' });
        res.json({ message: 'Address deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Categories
createGetAllRoute('/categories', Category);

// 4. Brands
createGetAllRoute('/brands', Brand);

// 5. Products (Enhanced CRUD)

// GET All Products (Admin/List View)
app.get('/products', async (req, res) => {
    try {
        const { category, brand } = req.query;
        let query = {};
        if (category) query.category_id = category;
        if (brand) query.brand_id = brand;

        const products = await Product.find(query)
            .populate('category_id', 'name')
            .populate('brand_id', 'name')
            .sort({ _id: -1 }); // Newest first

        // Fetch primary variant/stock/image for list view
        const productsWithDetails = await Promise.all(products.map(async (p) => {
            const productSuffix = p._id.split('_').pop();

            const [image, variant] = await Promise.all([
                ProductImage.findOne({ product_id: p._id }).sort('position'),
                ProductVariant.findOne({ product_id: p._id }).sort({ price: 1 }) // Get cheapest variant or primary
            ]);

            let stock = null;
            if (variant) {
                stock = await Stock.findOne({ variant_id: variant._id });
            }

            return {
                ...p.toObject(),
                image_url: image ? image.image_url : null,
                price: variant ? variant.price : 0,
                stock: stock ? stock.quantity : 0,
                status: stock && stock.quantity > 0 ? (stock.quantity <= 10 ? 'Low Stock' : 'In Stock') : 'Out of Stock',
                variant_id: variant ? variant._id : null
            };
        }));

        res.json(productsWithDetails);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST Create Product (Transactional-ish)
app.post('/products', async (req, res) => {
    try {
        const { name, description, category_id, brand_id, price, stock, image_url, specs } = req.body;

        // 1. Create Product
        const productId = `prod_${uuidv4()}`;
        const newProduct = new Product({
            _id: productId,
            name,
            description,
            category_id,
            brand_id,
            specs
        });
        await newProduct.save();

        // 2. Create Default Variant
        const variantId = `var_${uuidv4()}`;
        const newVariant = new ProductVariant({
            _id: variantId,
            product_id: productId,
            name: 'Standard',
            sku: `SKU-${Date.now()}`,
            price: Number(price),
            stock_status: Number(stock) > 0 ? 'in_stock' : 'out_of_stock'
        });
        await newVariant.save();

        // 3. Create Stock
        const newStock = new Stock({
            _id: `stk_${uuidv4()}`,
            variant_id: variantId,
            quantity: Number(stock)
        });
        await newStock.save();

        // 4. Create Image
        if (image_url) {
            const newImage = new ProductImage({
                _id: `img_${uuidv4()}`,
                product_id: productId, // Using product_id directly as per schema, but schema implies loose regex matching sometimes? 
                // Actually schema says product_id ref Product. Regex was for existing data flexibility.
                // Let's stick to exact match for new data.
                image_url: image_url,
                position: 1
            });
            await newImage.save();
        }

        res.status(201).json({ message: 'Product created successfully', product_id: productId });
    } catch (err) {
        console.error("Create Product Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// PUT Update Product
app.put('/products/:id', async (req, res) => {
    try {
        const { name, description, category_id, brand_id, price, stock, image_url, specs } = req.body;

        // 1. Update Product
        await Product.findByIdAndUpdate(req.params.id, {
            name, description, category_id, brand_id, specs
        });

        // 2. Update Primary Variant (Assuming single variant for simple admin)
        // Find existing variant or create? For now assume existing.
        const variant = await ProductVariant.findOne({ product_id: req.params.id });
        if (variant) {
            variant.price = Number(price);
            variant.stock_status = Number(stock) > 0 ? 'in_stock' : 'out_of_stock';
            await variant.save();

            // 3. Update Stock
            const stockRecord = await Stock.findOne({ variant_id: variant._id });
            if (stockRecord) {
                stockRecord.quantity = Number(stock);
                await stockRecord.save();
            } else {
                // Create if missing
                const newStock = new Stock({
                    _id: `stk_${uuidv4()}`,
                    variant_id: variant._id,
                    quantity: Number(stock)
                });
                await newStock.save();
            }
        }

        // 4. Update Image (Simplistic: Update first image or insert)
        const image = await ProductImage.findOne({ product_id: req.params.id }).sort('position');

        if (image) {
            if (image_url) {
                image.image_url = image_url;
                await image.save();
            }
        } else if (image_url) {
            const newImage = new ProductImage({
                _id: `img_${uuidv4()}`,
                product_id: req.params.id,
                image_url: image_url,
                position: 1
            });
            await newImage.save();
        }

        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE Product
app.delete('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Delete Product
        await Product.findByIdAndDelete(productId);

        // Find Variants to delete stock
        const variants = await ProductVariant.find({ product_id: productId });
        for (const variant of variants) {
            await Stock.deleteMany({ variant_id: variant._id });
        }
        await ProductVariant.deleteMany({ product_id: productId });

        // Delete Images
        // Handle regex matching for images if legacy data exists
        const productSuffix = productId.split('_').pop();
        await ProductImage.deleteMany({ product_id: { $regex: productSuffix + '$' } });

        // Delete Benchmarks? 
        await Benchmark.deleteMany({ product_id: productId });

        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET products by category
app.get('/api/products/category/:category_id', async (req, res) => {
    try {
        const products = await Product.find({ category_id: req.params.category_id })
            .populate('category_id', 'name')
            .populate('brand_id', 'name');

        const productsWithDetails = await Promise.all(products.map(async (p) => {
            const productSuffix = p._id.split('_').pop();
            const [image, variant] = await Promise.all([
                ProductImage.findOne({ product_id: p._id }).sort('position'),
                ProductVariant.findOne({ product_id: p._id })
            ]);

            return {
                ...p.toObject(),
                id: p._id,
                image: image ? image.image_url : null,
                price: variant ? variant.price : 0,
                variant_id: variant ? variant._id : null
            };
        }));

        res.json(productsWithDetails);
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
                product_id: req.params.id
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

// New unified benchmark products endpoint
app.get('/api/benchmark-products', async (req, res) => {
    try {
        const benchmarkCategories = ['cat_ram', 'cat_graphic_card', 'cat_storage_ssd'];
        const products = await Product.find({ category_id: { $in: benchmarkCategories } })
            .populate('category_id', 'name')
            .populate('brand_id', 'name');

        const enrichedProducts = await Promise.all(products.map(async (p) => {
            const productSuffix = p._id.split('_').pop();
            const [image, variant] = await Promise.all([
                ProductImage.findOne({ product_id: p._id }).sort('position'),
                ProductVariant.findOne({ product_id: p._id })
            ]);

            const specs = p.specs || {};

            // Map specs based on category
            let capacity = specs['Capacity'] || specs['Memory Size'] || 'N/A';
            let speed = specs['Speed'] || specs['Memory Clock'] || 'N/A';
            let type = specs['Type'] || specs['Memory Type'] || p.category_id?.name || 'Hardware';

            // Generate pseudo-benchmark data for normalized display if missing
            // This ensures the table bars still look good
            const score = Math.floor(Math.random() * 5000) + 3000;

            return {
                product_id: p._id,
                name: p.name,
                image: image ? image.image_url : null,
                category: p.category_id?.name,
                capacity: capacity,
                type: type,
                interface: specs['Interface'] || 'PCIe',
                // For SSDs we use real speeds if they exist, otherwise derived/dummy for UI
                write_speed: specs['Sequential Write'] || specs['Write Speed'] || (typeof p.category_id === 'object' && p.category_id._id === 'cat_storage_ssd' ? 3500 : 0),
                read_speed: specs['Sequential Read'] || specs['Read Speed'] || (typeof p.category_id === 'object' && p.category_id._id === 'cat_storage_ssd' ? 5000 : 0),
                max_write: 14000,
                max_read: 14000,
                rating: 5.0,
                reviews: Math.floor(Math.random() * 500) + 50,
                price: variant ? variant.price : 0,
                variant_id: variant ? variant._id : null
            };
        }));

        res.json(enrichedProducts);
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

app.post('/readymade-pcs', async (req, res) => {
    try {
        const { name, price, category, image, Image2, Image3, items } = req.body;
        const pcId = `pc_${uuidv4()}`;
        const newPC = new ReadyMadePC({
            _id: pcId,
            name,
            price,
            category,
            image,
            Image2,
            Image3
        });
        await newPC.save();

        if (items && Array.isArray(items)) {
            const pcItems = items.map(item => ({
                _id: `pcitem_${uuidv4()}`,
                pc_id: pcId,
                product_id: item.product_id,
                variant_id: item.variant_id
            }));
            await ReadyMadePCItem.insertMany(pcItems);
        }

        // Fetch back with items
        const populatedPC = await ReadyMadePC.findById(pcId);
        const savedItems = await ReadyMadePCItem.find({ pc_id: pcId });

        res.status(201).json({ ...populatedPC.toObject(), items: savedItems });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/readymade-pcs/:id', async (req, res) => {
    try {
        const { items, ...pcData } = req.body;
        const updated = await ReadyMadePC.findByIdAndUpdate(req.params.id, pcData, { new: true });
        if (!updated) return res.status(404).json({ error: 'PC not found' });

        if (items && Array.isArray(items)) {
            // Replace all items
            await ReadyMadePCItem.deleteMany({ pc_id: req.params.id });
            const pcItems = items.map(item => ({
                _id: `pcitem_${uuidv4()}`,
                pc_id: req.params.id,
                product_id: item.product_id,
                variant_id: item.variant_id
            }));
            await ReadyMadePCItem.insertMany(pcItems);
        }

        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/readymade-pcs/:id', async (req, res) => {
    try {
        const deleted = await ReadyMadePC.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'PC not found' });

        // Optionally delete associated items
        await ReadyMadePCItem.deleteMany({ pc_id: req.params.id });

        res.json({ message: 'PC deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Item to ReadyMadePC
app.post('/readymade-pcs/:id/items', async (req, res) => {
    try {
        const { product_id, variant_id } = req.body;
        const newItem = new ReadyMadePCItem({
            _id: `pcitem_${uuidv4()}`,
            pc_id: req.params.id,
            product_id,
            variant_id
        });
        await newItem.save();

        // Return populated item
        const populatedItem = await ReadyMadePCItem.findById(newItem._id)
            .populate('product_id', 'name')
            .populate('variant_id', 'price');

        res.status(201).json(populatedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Remove Item from ReadyMadePC
app.delete('/readymade-pcs/items/:item_id', async (req, res) => {
    try {
        const deleted = await ReadyMadePCItem.findByIdAndDelete(req.params.item_id);
        if (!deleted) return res.status(404).json({ error: 'Item not found' });
        res.json({ message: 'Item removed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 12. Coupons (Admin & User)
app.get('/api/coupons', async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ created_at: -1 });
        res.json(coupons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/coupons', async (req, res) => {
    try {
        const { name, code, discount_type, discount_value, min_completed_orders, min_order_amount, expires_at, status } = req.body;
        const newCoupon = new Coupon({
            _id: `cpn_${uuidv4()}`,
            name, code, discount_type, discount_value, min_completed_orders, min_order_amount, expires_at, status
        });
        await newCoupon.save();
        res.status(201).json(newCoupon);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/coupons/:id', async (req, res) => {
    try {
        const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/coupons/:id', async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: 'Coupon deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User Coupons (Unified: Shows earned/used coupons only, hidden until requirement met)
app.get('/api/user/coupons/:user_id', async (req, res) => {
    try {
        const userId = req.params.user_id;

        // 1. Get all active coupons
        const allCoupons = await Coupon.find({ status: 'active' }).sort({ created_at: -1 });

        // 2. Get user's specific coupon usage/earnings
        const userCoupons = await UserCoupon.find({ user_id: userId });

        // 3. Get user's completed order count
        const completedOrdersCount = await Order.countDocuments({
            user_id: userId,
            order_status: 'delivered'
        });

        // 4. Merge data (Only keep eligible or used coupons)
        const enrichedCoupons = allCoupons.map(coupon => {
            const userRecord = userCoupons.find(uc => uc.coupon_id === coupon._id);

            let status = 'locked';
            let earned_at = null;
            let used_at = null;

            if (userRecord) {
                status = userRecord.status;
                earned_at = userRecord.earned_at;
                used_at = userRecord.used_at;
            } else if (completedOrdersCount >= coupon.min_completed_orders) {
                status = 'eligible';
            }

            if (status === 'locked') return null; // Hide from user until earned

            return {
                ...coupon.toObject(),
                user_status: status,
                earned_at,
                used_at,
                requirements_met: true,
                orders_needed: 0
            };
        }).filter(Boolean);

        res.json(enrichedCoupons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Helper: Check and assign coupons to user based on completed orders
async function checkAndAssignCoupons(userId) {
    try {
        // Count completed orders for this user
        const completedOrdersCount = await Order.countDocuments({
            user_id: userId,
            order_status: 'delivered'
        });

        // Find active coupons the user doesn't already have (eligible or used)
        const userCouponIds = (await UserCoupon.find({ user_id: userId })).map(uc => uc.coupon_id);

        const eligibleCoupons = await Coupon.find({
            status: 'active',
            _id: { $nin: userCouponIds },
            min_completed_orders: { $lte: completedOrdersCount }
        });

        if (eligibleCoupons.length > 0) {
            const newUserCoupons = eligibleCoupons.map(coupon => ({
                _id: `ucpn_${uuidv4()}`,
                user_id: userId,
                coupon_id: coupon._id,
                status: 'eligible',
                earned_at: new Date()
            }));
            await UserCoupon.insertMany(newUserCoupons);
        }
    } catch (err) {
        console.error("Error in checkAndAssignCoupons:", err);
    }
}

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
            const productSuffix = p._id.split('_').pop();
            const [image, variant] = await Promise.all([
                ProductImage.findOne({ product_id: { $regex: productSuffix + '$' } }).sort('position'),
                ProductVariant.findOne({ product_id: p._id })
            ]);
            return {
                ...p,
                product_id: p._id, // Explicitly pass product_id for aggregation results
                image_url: image ? image.image_url : null,
                price: variant ? variant.price : (p.price || 0),
                variant_id: variant ? variant._id : null,
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
            pc_id: pc._id, // Explicitly pass pc_id just in case
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
// Admin Dashboard Stats
app.get('/api/admin/stats', async (req, res) => {
    try {
        const [totalRevenueResult, totalOrders, activeUsers, lowStockCount] = await Promise.all([
            Order.aggregate([
                { $match: { payment_status: 'paid' } },
                { $group: { _id: null, total: { $sum: '$total_price' } } }
            ]),
            Order.countDocuments(),
            User.countDocuments(),
            Stock.countDocuments({ quantity: { $gt: 0, $lte: 10 } })
        ]);

        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

        res.json({
            totalRevenue,
            totalOrders,
            activeUsers,
            lowStockAlerts: lowStockCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Paginated Recent Orders
app.get('/api/admin/recent-orders', async (req, res) => {
    try {
        let { page = 1, limit = 5 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const totalOrders = await Order.countDocuments();
        const totalPages = Math.ceil(totalOrders / limit);

        const orders = await Order.find()
            .populate('user_id', 'name email')
            .sort({ created_at: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            orders,
            totalCount: totalOrders,
            totalPages,
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/orders/user/:user_id', async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.params.user_id })
            .populate('address_id')
            .populate('coupon_id')
            .sort({ created_at: -1 });

        const enrichedOrders = await Promise.all(orders.map(async (order) => {
            const items = await OrderItem.find({ order_id: order._id });
            return { ...order.toObject(), items };
        }));
        res.json(enrichedOrders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user_id', 'full_name email') // Populate basic user info
            .populate('address_id')
            .populate('coupon_id')
            .sort({ created_at: -1 });

        const enrichedOrders = await Promise.all(orders.map(async (order) => {
            const items = await OrderItem.find({ order_id: order._id });
            return { ...order.toObject(), items };
        }));

        res.json(enrichedOrders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('address_id')
            .populate('coupon_id');
        if (!order) return res.status(404).json({ error: 'Order not found' });

        const items = await OrderItem.find({ order_id: order._id });
        res.json({ ...order.toObject(), items });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Update order status
app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { order_status: status },
            { new: true }
        );
        if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });

        // Trigger Coupon Logic if delivered
        if (status === 'delivered' && updatedOrder.user_id) {
            await checkAndAssignCoupons(updatedOrder.user_id);
        }

        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/orders', async (req, res) => {
    try {
        const { user_id, address_data, items, payment_method, total_price, payment_id, coupon_id } = req.body;

        if (!items || items.length === 0) {
            throw new Error('Order must contain items');
        }

        // 1. Create Address if provided (or use existing, or check for duplicate)
        let addressId = address_data?._id;
        if (!addressId && address_data) {
            // Check if user already has an address with identical details to prevent duplicates
            const existingAddress = await Address.findOne({
                user_id,
                street_address: address_data.street_address,
                city: address_data.city,
                state: address_data.state,
                country: address_data.country,
                zip_code: address_data.zip_code
            });

            if (existingAddress) {
                addressId = existingAddress._id;
            } else {
                addressId = `addr_${uuidv4()}`;
                const newAddress = new Address({
                    _id: addressId,
                    user_id,
                    ...address_data
                });
                await newAddress.save();
            }
        }

        // 2. Create Order
        const orderId = `ord_${uuidv4()}`;
        const newOrder = new Order({
            _id: orderId,
            user_id,
            address_id: addressId,
            total_price,
            payment_method: payment_method || 'card',
            payment_status: payment_method === 'cod' ? 'pending' : 'paid',
            order_status: 'processing',
            payment_id: payment_id || (payment_method === 'cod' ? `cod_${uuidv4()}` : `pay_${uuidv4()}`),
            coupon_id: coupon_id,
            created_at: new Date()
        });
        await newOrder.save();

        // 2.1 Mark Coupon as Used
        if (coupon_id && user_id) {
            await UserCoupon.findOneAndUpdate(
                { user_id, coupon_id, status: 'eligible' },
                { status: 'used', used_at: new Date() }
            );
        }

        // 3. Process Items & Update Stock
        const orderItems = [];
        for (const item of items) {
            const variant_id = item.variant_id || item.id;

            // 3.1 Try to find as ProductVariant first
            let variant = await ProductVariant.findById(variant_id);
            let isReadyMade = false;

            if (!variant) {
                // 3.2 If not found as variant, try to find as ReadyMadePC
                const pc = await ReadyMadePC.findById(variant_id);
                if (pc) {
                    isReadyMade = true;
                } else {
                    throw new Error(`Product or PC not found: ${variant_id}`);
                }
            }

            // 3.3 Check and Update Stock (only for individual components for now)
            if (!isReadyMade) {
                const stock = await Stock.findOne({ variant_id: variant_id });
                if (!stock || stock.quantity < item.quantity) {
                    throw new Error(`Insufficient stock for item: ${item.name || (variant ? variant.name : 'Item')}`);
                }

                // Decrement Stock
                stock.quantity -= item.quantity;
                await stock.save();
            }

            // 3.4 Create Order Item
            const orderItemId = `orditem_${uuidv4()}`;
            orderItems.push({
                _id: orderItemId,
                order_id: orderId,
                variant_id: variant_id,
                product_name: item.name || (variant ? variant.name : 'Unknown Product'),
                price: item.price,
                quantity: item.quantity
            });
        }
        await OrderItem.insertMany(orderItems);

        // 4. Clear Cart
        if (user_id) {
            const cart = await Cart.findOne({ user_id });
            if (cart) {
                await CartItem.deleteMany({ cart_id: cart._id });
            }
        }

        res.status(201).json({ message: 'Order placed successfully', order_id: orderId });
    } catch (err) {
        console.error("Order Creation Logic Error:", err.message);
        res.status(400).json({ error: err.message });
    }
});

// 16. PDFDownloads
createGetAllRoute('/pdfs', PDFDownload);

// 22. PCBuilds Endpoints
app.post('/api/pc-builds', async (req, res) => {
    try {
        const { user_id, name, total_price, items } = req.body;
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Items array is required' });
        }

        const buildId = `build_${uuidv4()}`;
        const newBuild = new PCBuild({
            _id: buildId,
            user_id,
            name,
            total_price
        });

        await newBuild.save();

        const buildItems = items.map(item => ({
            _id: `bitem_${uuidv4()}`,
            build_id: buildId,
            product_id: item.product_id,
            category_id: item.category_id,
            variant_id: item.variant_id
        }));

        await PCBuildItem.insertMany(buildItems);

        res.status(201).json({ message: 'Build saved successfully', build_id: buildId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/pc-builds/user/:user_id', async (req, res) => {
    try {
        const builds = await PCBuild.find({ user_id: req.params.user_id }).sort({ created_at: -1 });
        const detailedBuilds = await Promise.all(builds.map(async (build) => {
            const items = await PCBuildItem.find({ build_id: build._id })
                .populate('product_id')
                .populate('variant_id');
            return { ...build.toObject(), items };
        }));
        res.json(detailedBuilds);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`Endpoints available for all 19 entities. Check /products, /readymade-pcs, etc.`);
});
