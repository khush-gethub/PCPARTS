const mongoose = require('mongoose');
const { Schema } = mongoose;

// --- 1. User Schema ---
const UserSchema = new Schema({
    user_id: { type: String, required: true, unique: true }, // UUID
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_: { type: String, required: true },
    phone: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    created_at: { type: Date, default: Date.now }
});

// --- 2. Address Schema ---
const AddressSchema = new Schema({
    address_id: { type: String, required: true, unique: true },
    user_id: { type: String, ref: 'User', required: true },
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    country: String
}); // No timestamps in source

// --- 3. Category Schema ---
const CategorySchema = new Schema({
    category_id: { type: String, required: true, unique: true },
    name: String
});

// --- 4. Brand Schema ---
const BrandSchema = new Schema({
    brand_id: { type: String, required: true, unique: true },
    name: String
});

// --- 5. Product Schema ---
const ProductSchema = new Schema({
    product_id: { type: String, required: true, unique: true },
    category_id: { type: String, ref: 'Category' },
    brand_id: { type: String, ref: 'Brand' },
    name: String,
    description: String,
    specs: Schema.Types.Mixed // jsonb -> Mixed
});

// --- 6. ProductVariant Schema ---
const ProductVariantSchema = new Schema({
    variant_id: { type: String, required: true, unique: true },
    product_id: { type: String, ref: 'Product' },
    name: String,
    sku: { type: String, unique: true },
    price: Number, // int
    discount_price: Number,
    stock_status: { type: String, enum: ["in_stock", "low_stock", "out_of_stock"] },
    weight: Number
});

// --- 7. Stock Schema ---
const StockSchema = new Schema({
    stock_id: { type: String, required: true, unique: true },
    variant_id: { type: String, ref: 'ProductVariant', unique: true },
    quantity: Number,
    updated_at: { type: Date, default: Date.now }
});

// --- 8. ProductImage Schema ---
const ProductImageSchema = new Schema({
    image_id: { type: String, required: true, unique: true },
    product_id: { type: String, ref: 'Product' },
    image_url: String,
    position: Number
});

// --- 9. Benchmark Schema ---
const BenchmarkSchema = new Schema({
    benchmark_id: { type: String, required: true, unique: true },
    product_id: { type: String, ref: 'Product' },
    name: String,
    score: Number, // float
    details: Schema.Types.Mixed
});

// --- 10. PCBuilderCompatibility Schema ---
const PCBuilderCompatibilitySchema = new Schema({
    compat_id: { type: String, required: true, unique: true },
    product_id: { type: String, ref: 'Product' },
    compatible_with_product_id: { type: String, ref: 'Product' },
    rule: String
});

// --- 11. ReadyMadePC Schema ---
const ReadyMadePCSchema = new Schema({
    pc_id: { type: String, required: true, unique: true },
    name: String,
    price: Number,
    category: String,
    image: String,
    Image2: String,
    Image3: String
});

// --- 12. ReadyMadePCItems Schema ---
const ReadyMadePCItemSchema = new Schema({
    item_id: { type: String, required: true, unique: true },
    pc_id: { type: String, ref: 'ReadyMadePC' },
    product_id: { type: String, ref: 'Product' },
    variant_id: { type: String, ref: 'ProductVariant' }
});

// --- 13. Coupon Schema ---
const CouponSchema = new Schema({
    coupon_id: { type: String, required: true, unique: true },
    code: { type: String, unique: true },
    discount_value: Number,
    min_order_amount: Number,
    expires_at: Date,
    usage_limit: Number,
    created_at: { type: Date, default: Date.now }
});

// --- 14. UserCoupon Schema ---
const UserCouponSchema = new Schema({
    user_coupon_id: { type: String, required: true, unique: true },
    user_id: { type: String, ref: 'User' },
    coupon_id: { type: String, ref: 'Coupon' },
    used_at: Date
});

// --- 15. Cart Schema ---
const CartSchema = new Schema({
    cart_id: { type: String, required: true, unique: true },
    user_id: { type: String, ref: 'User' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// --- 16. CartItem Schema ---
const CartItemSchema = new Schema({
    cart_item_id: { type: String, required: true, unique: true },
    cart_id: { type: String, ref: 'Cart' },
    variant_id: { type: String, ref: 'ProductVariant' },
    quantity: Number,
    price_snapshot: Number
});

// --- 17. Order Schema ---
const OrderSchema = new Schema({
    order_id: { type: String, required: true, unique: true },
    user_id: { type: String, ref: 'User' },
    address_id: { type: String, ref: 'Address' },
    total_price: Number,
    payment_status: { type: String, enum: ["pending", "paid", "failed"] },
    order_status: { type: String, enum: ["processing", "shipped", "delivered", "cancelled"] },
    payment_id: String,
    created_at: { type: Date, default: Date.now }
});

// --- 18. OrderItem Schema ---
const OrderItemSchema = new Schema({
    order_item_id: { type: String, required: true, unique: true },
    order_id: { type: String, ref: 'Order' },
    variant_id: { type: String, ref: 'ProductVariant' },
    product_name: String,
    price: Number,
    quantity: Number
});

// --- 19. PDFDownload Schema ---
const PDFDownloadSchema = new Schema({
    pdf_id: { type: String, required: true, unique: true },
    user_id: { type: String, ref: 'User' },
    order_id: { type: String, ref: 'Order' },
    pdf_url: String,
    created_at: { type: Date, default: Date.now }
});

const models = {
    User: mongoose.model('User', UserSchema, 'users'),
    Address: mongoose.model('Address', AddressSchema, 'addresses'),
    Category: mongoose.model('Category', CategorySchema, 'categories'),
    Brand: mongoose.model('Brand', BrandSchema, 'brands'),
    Product: mongoose.model('Product', ProductSchema, 'products'),
    ProductVariant: mongoose.model('ProductVariant', ProductVariantSchema, 'product_variants'),
    Stock: mongoose.model('Stock', StockSchema, 'stock'),
    ProductImage: mongoose.model('ProductImage', ProductImageSchema, 'product_images'),
    Benchmark: mongoose.model('Benchmark', BenchmarkSchema, 'benchmarks'),
    PCBuilderCompatibility: mongoose.model('PCBuilderCompatibility', PCBuilderCompatibilitySchema, 'pc_builder_compatibility'),
    ReadyMadePC: mongoose.model('ReadyMadePC', ReadyMadePCSchema, 'ready_made_pc'),
    ReadyMadePCItem: mongoose.model('ReadyMadePCItems', ReadyMadePCItemSchema, 'ready_made_pc_items'),
    Coupon: mongoose.model('Coupon', CouponSchema, 'coupons'),
    UserCoupon: mongoose.model('UserCoupon', UserCouponSchema, 'user_coupons'),
    Cart: mongoose.model('Cart', CartSchema, 'cart'),
    CartItem: mongoose.model('CartItems', CartItemSchema, 'cart_items'),
    Order: mongoose.model('Order', OrderSchema, 'orders'),
    OrderItem: mongoose.model('OrderItems', OrderItemSchema, 'order_items'),
    PDFDownload: mongoose.model('PDFDownload', PDFDownloadSchema, 'pdf_downloads')
};

module.exports = models;
