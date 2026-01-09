const mongoose = require('mongoose');
const { Schema } = mongoose;

// Helper to disable auto _id and enable virtuals
const schemaOptions = {
    _id: false,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};

// 1. Users
const userSchema = new Schema({
    _id: { type: String, required: true }, // UUID
    name: { type: String },
    email: { type: String, unique: true },
    password_: { type: String },
    phone: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    created_at: { type: Date, default: Date.now }
}, schemaOptions);
userSchema.virtual('user_id').get(function () { return this._id; });

// 2. Addresses
const addressSchema = new Schema({
    _id: { type: String, required: true },
    user_id: { type: String, ref: 'User' },
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String }
}, schemaOptions);
addressSchema.virtual('address_id').get(function () { return this._id; });

// 3. Categories
const categorySchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String }
}, schemaOptions);
categorySchema.virtual('category_id').get(function () { return this._id; });

// 4. Brands
const brandSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String }
}, schemaOptions);
brandSchema.virtual('brand_id').get(function () { return this._id; });

// 5. Products
const productSchema = new Schema({
    _id: { type: String, required: true },
    category_id: { type: String, ref: 'Category' },
    brand_id: { type: String, ref: 'Brand' },
    name: { type: String },
    description: { type: String },
    specs: { type: Schema.Types.Mixed }
}, schemaOptions);
productSchema.virtual('product_id').get(function () { return this._id; });

// 6. ProductVariants
const productVariantSchema = new Schema({
    _id: { type: String, required: true },
    product_id: { type: String, ref: 'Product' },
    name: { type: String },
    sku: { type: String, unique: true },
    price: { type: Number },
    discount_price: { type: Number },
    stock_status: { type: String, enum: ['in_stock', 'low_stock', 'out_of_stock'] },
    weight: { type: Number }
}, schemaOptions);
productVariantSchema.virtual('variant_id').get(function () { return this._id; });

// 7. Stock
const stockSchema = new Schema({
    _id: { type: String, required: true },
    variant_id: { type: String, ref: 'ProductVariant', unique: true },
    quantity: { type: Number },
    updated_at: { type: Date, default: Date.now }
}, schemaOptions);
stockSchema.virtual('stock_id').get(function () { return this._id; });

// 8. ProductImages
const productImageSchema = new Schema({
    _id: { type: String, required: true },
    product_id: { type: String, ref: 'Product' },
    image_url: { type: String },
    position: { type: Number }
}, schemaOptions);
productImageSchema.virtual('image_id').get(function () { return this._id; });

// 9. Benchmarks
const benchmarkSchema = new Schema({
    _id: { type: String, required: true },
    product_id: { type: String, ref: 'Product' },
    name: { type: String },
    score: { type: Number },
    details: { type: Schema.Types.Mixed }
}, schemaOptions);
benchmarkSchema.virtual('benchmark_id').get(function () { return this._id; });

// 10. PCBuilderCompatibility
const pcBuilderCompatibilitySchema = new Schema({
    _id: { type: String, required: true },
    product_id: { type: String, ref: 'Product' },
    compatible_with_product_id: { type: String, ref: 'Product' },
    rule: { type: String }
}, schemaOptions);
pcBuilderCompatibilitySchema.virtual('compat_id').get(function () { return this._id; });

// 11. ReadyMadePC
const readyMadePCSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String },
    price: { type: Number },
    category: { type: String },
    image: { type: String },
    Image2: { type: String },
    Image3: { type: String }
}, schemaOptions);
readyMadePCSchema.virtual('pc_id').get(function () { return this._id; });

// 12. ReadyMadePCItems
const readyMadePCItemSchema = new Schema({
    _id: { type: String, required: true },
    pc_id: { type: String, ref: 'ReadyMadePC' },
    product_id: { type: String, ref: 'Product' },
    variant_id: { type: String, ref: 'ProductVariant' }
}, schemaOptions);
readyMadePCItemSchema.virtual('item_id').get(function () { return this._id; });

// 13. Coupons
const couponSchema = new Schema({
    _id: { type: String, required: true },
    code: { type: String, unique: true },
    discount_value: { type: Number },
    min_order_amount: { type: Number },
    expires_at: { type: Date },
    usage_limit: { type: Number },
    created_at: { type: Date, default: Date.now }
}, schemaOptions);
couponSchema.virtual('coupon_id').get(function () { return this._id; });

// 14. UserCoupons
const userCouponSchema = new Schema({
    _id: { type: String, required: true },
    user_id: { type: String, ref: 'User' },
    coupon_id: { type: String, ref: 'Coupon' },
    used_at: { type: Date }
}, schemaOptions);
userCouponSchema.virtual('user_coupon_id').get(function () { return this._id; });

// 15. Cart
const cartSchema = new Schema({
    _id: { type: String, required: true },
    user_id: { type: String, ref: 'User' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, schemaOptions);
cartSchema.virtual('cart_id').get(function () { return this._id; });

// 16. CartItems
const cartItemSchema = new Schema({
    _id: { type: String, required: true },
    cart_id: { type: String, ref: 'Cart' },
    variant_id: { type: String, ref: 'ProductVariant' },
    quantity: { type: Number },
    price_snapshot: { type: Number }
}, schemaOptions);
cartItemSchema.virtual('cart_item_id').get(function () { return this._id; });

// 17. Orders
const orderSchema = new Schema({
    _id: { type: String, required: true },
    user_id: { type: String, ref: 'User' },
    address_id: { type: String, ref: 'Address' },
    total_price: { type: Number },
    payment_status: { type: String, enum: ['pending', 'paid', 'failed'] },
    order_status: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'] },
    payment_id: { type: String },
    created_at: { type: Date, default: Date.now }
}, schemaOptions);
orderSchema.virtual('order_id').get(function () { return this._id; });

// 18. OrderItems
const orderItemSchema = new Schema({
    _id: { type: String, required: true },
    order_id: { type: String, ref: 'Order' },
    variant_id: { type: String, ref: 'ProductVariant' },
    product_name: { type: String },
    price: { type: Number },
    quantity: { type: Number }
}, schemaOptions);
orderItemSchema.virtual('order_item_id').get(function () { return this._id; });

// 19. PDFDownloads
const pdfDownloadSchema = new Schema({
    _id: { type: String, required: true },
    user_id: { type: String, ref: 'User' },
    order_id: { type: String, ref: 'Order' },
    pdf_url: { type: String },
    created_at: { type: Date, default: Date.now }
}, schemaOptions);
pdfDownloadSchema.virtual('pdf_id').get(function () { return this._id; });

// Exports
module.exports = {
    User: mongoose.model('User', userSchema),
    Address: mongoose.model('Address', addressSchema),
    Category: mongoose.model('Category', categorySchema),
    Brand: mongoose.model('Brand', brandSchema),
    Product: mongoose.model('Product', productSchema),
    ProductVariant: mongoose.model('ProductVariant', productVariantSchema),
    Stock: mongoose.model('Stock', stockSchema),
    ProductImage: mongoose.model('ProductImage', productImageSchema),
    Benchmark: mongoose.model('Benchmark', benchmarkSchema),
    PCBuilderCompatibility: mongoose.model('PCBuilderCompatibility', pcBuilderCompatibilitySchema),
    ReadyMadePC: mongoose.model('ReadyMadePC', readyMadePCSchema),
    ReadyMadePCItem: mongoose.model('ReadyMadePCItem', readyMadePCItemSchema),
    Coupon: mongoose.model('Coupon', couponSchema),
    UserCoupon: mongoose.model('UserCoupon', userCouponSchema),
    Cart: mongoose.model('Cart', cartSchema),
    CartItem: mongoose.model('CartItem', cartItemSchema),
    Order: mongoose.model('Order', orderSchema),
    OrderItem: mongoose.model('OrderItem', orderItemSchema),
    PDFDownload: mongoose.model('PDFDownload', pdfDownloadSchema)
};
