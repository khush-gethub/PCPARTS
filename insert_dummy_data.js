// MongoDB Dummy Data Insertion Script
// Usage: load("insert_dummy_data.js") inside 'mongosh' or MongoDB Compass Shell

// Helper to generate UUID-like string
function genUUID() {
    return new ObjectId().toString(); // Using ObjectId hex string for simplicity and uniqueness
}

// Helper to get random item from array
function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to random integer
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to random date
function getRandomDate() {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

print("Starting Data Generation...");

// 1. Users (20 records)
const userIds = [];
const users = [];
for (let i = 0; i < 20; i++) {
    const uid = genUUID();
    userIds.push(uid);
    users.push({
        user_id: uid,
        name: "User " + i,
        email: "user" + i + "@example.com",
        password_: "hashedpassword" + i,
        phone: "555-010" + i,
        role: i === 0 ? "admin" : "user",
        created_at: getRandomDate()
    });
}
db.users.insertMany(users);
print("Users inserted.");

// 2. Addresses (20 records)
const addressIds = [];
const addresses = [];
for (let i = 0; i < 20; i++) {
    const aid = genUUID();
    addressIds.push(aid);
    addresses.push({
        address_id: aid,
        user_id: getRandom(userIds),
        line1: i + " Main St",
        line2: "Apt " + i,
        city: "City " + i,
        state: "State " + i,
        pincode: "1000" + i,
        country: "Country " + i
    });
}
db.addresses.insertMany(addresses);
print("Addresses inserted.");

// 3. Categories (20 records)
const categoryIds = [];
const categories = [];
for (let i = 0; i < 20; i++) {
    const cid = genUUID();
    categoryIds.push(cid);
    categories.push({
        category_id: cid,
        name: "Category " + i
    });
}
db.categories.insertMany(categories);
print("Categories inserted.");

// 4. Brands (20 records)
const brandIds = [];
const brands = [];
for (let i = 0; i < 20; i++) {
    const bid = genUUID();
    brandIds.push(bid);
    brands.push({
        brand_id: bid,
        name: "Brand " + i
    });
}
db.brands.insertMany(brands);
print("Brands inserted.");

// 5. Products (20 records)
const productIds = [];
const products = [];
for (let i = 0; i < 20; i++) {
    const pid = genUUID();
    productIds.push(pid);
    products.push({
        product_id: pid,
        category_id: getRandom(categoryIds),
        brand_id: getRandom(brandIds),
        name: "Product " + i,
        description: "Description for product " + i,
        specs: { model: "Model" + i, year: 2024 }
    });
}
db.products.insertMany(products);
print("Products inserted.");

// 6. ProductVariants (20 records)
const variantIds = [];
const variants = [];
for (let i = 0; i < 20; i++) {
    const vid = genUUID();
    variantIds.push(vid);
    variants.push({
        variant_id: vid,
        product_id: getRandom(productIds),
        name: "Variant " + i,
        sku: "SKU-" + i + "-" + Math.random().toString(36).substring(7),
        price: getRandomInt(100, 2000),
        discount_price: getRandomInt(50, 99),
        stock_status: getRandom(["in_stock", "low_stock", "out_of_stock"]),
        weight: getRandomInt(1, 5)
    });
}
db.product_variants.insertMany(variants);
print("ProductVariants inserted.");

// 7. Stock (20 records)
const stock = [];
for (let i = 0; i < 20; i++) {
    stock.push({
        stock_id: genUUID(),
        variant_id: variants[i].variant_id, // 1:1 mapping for simplicity to avoid unique error
        quantity: getRandomInt(0, 100),
        updated_at: new Date()
    });
}
db.stock.insertMany(stock);
print("Stock inserted.");

// 8. ProductImages (20 records)
const images = [];
for (let i = 0; i < 20; i++) {
    images.push({
        image_id: genUUID(),
        product_id: getRandom(productIds),
        image_url: "http://example.com/img" + i + ".jpg",
        position: i
    });
}
db.product_images.insertMany(images);
print("ProductImages inserted.");

// 9. Benchmarks (20 records)
const benchmarks = [];
for (let i = 0; i < 20; i++) {
    benchmarks.push({
        benchmark_id: genUUID(),
        product_id: getRandom(productIds),
        name: "Benchmark " + i,
        score: getRandomInt(5000, 20000),
        details: { cpu_temp: "60C", test: "Pass" }
    });
}
db.benchmarks.insertMany(benchmarks);
print("Benchmarks inserted.");

// 10. PCBuilderCompatibility (20 records)
const compat = [];
for (let i = 0; i < 20; i++) {
    compat.push({
        compat_id: genUUID(),
        product_id: getRandom(productIds),
        compatible_with_product_id: getRandom(productIds),
        rule: "Socket AM" + i
    });
}
db.pc_builder_compatibility.insertMany(compat);
print("PCBuilderCompatibility inserted.");

// 11. ReadyMadePC (20 records)
const pcIds = [];
const pcs = [];
for (let i = 0; i < 20; i++) {
    const pcid = genUUID();
    pcIds.push(pcid);
    pcs.push({
        pc_id: pcid,
        name: "Gaming PC " + i,
        price: getRandomInt(1000, 5000),
        category: "High-End",
        image: "pc" + i + ".jpg",
        Image2: "pc" + i + "_side.jpg",
        Image3: "pc" + i + "_rear.jpg"
    });
}
db.ready_made_pc.insertMany(pcs);
print("ReadyMadePC inserted.");

// 12. ReadyMadePCItems (20 records)
const pcItems = [];
for (let i = 0; i < 20; i++) {
    pcItems.push({
        item_id: genUUID(),
        pc_id: getRandom(pcIds),
        product_id: getRandom(productIds),
        variant_id: getRandom(variantIds)
    });
}
db.ready_made_pc_items.insertMany(pcItems);
print("ReadyMadePCItems inserted.");

// 13. Coupons (20 records)
const couponIds = [];
const coupons = [];
for (let i = 0; i < 20; i++) {
    const cid = genUUID();
    couponIds.push(cid);
    coupons.push({
        coupon_id: cid,
        code: "SAVE" + i + getRandomInt(100, 999),
        discount_value: getRandomInt(10, 50),
        min_order_amount: 100,
        expires_at: new Date(2026, 0, 1),
        usage_limit: 100,
        created_at: new Date()
    });
}
db.coupons.insertMany(coupons);
print("Coupons inserted.");

// 14. UserCoupons (20 records)
const userCoupons = [];
for (let i = 0; i < 20; i++) {
    userCoupons.push({
        user_coupon_id: genUUID(),
        user_id: getRandom(userIds),
        coupon_id: getRandom(couponIds),
        used_at: new Date()
    });
}
db.user_coupons.insertMany(userCoupons);
print("UserCoupons inserted.");

// 15. Cart (20 records)
const cartIds = [];
const carts = [];
for (let i = 0; i < 20; i++) {
    const cid = genUUID();
    cartIds.push(cid);
    carts.push({
        cart_id: cid,
        user_id: getRandom(userIds), // Some users might have multiple carts in this dummy data or share (unlikely in real app but ok here)
        created_at: new Date(),
        updated_at: new Date()
    });
}
db.cart.insertMany(carts);
print("Cart inserted.");

// 16. CartItems (20 records)
const cartItems = [];
for (let i = 0; i < 20; i++) {
    cartItems.push({
        cart_item_id: genUUID(),
        cart_id: getRandom(cartIds),
        variant_id: getRandom(variantIds),
        quantity: getRandomInt(1, 5),
        price_snapshot: getRandomInt(100, 2000)
    });
}
db.cart_items.insertMany(cartItems);
print("CartItems inserted.");

// 17. Orders (20 records)
const orderIds = [];
const orders = [];
for (let i = 0; i < 20; i++) {
    const oid = genUUID();
    orderIds.push(oid);
    orders.push({
        order_id: oid,
        user_id: getRandom(userIds),
        address_id: getRandom(addressIds),
        total_price: getRandomInt(2000, 10000),
        payment_status: getRandom(["pending", "paid", "failed"]),
        order_status: getRandom(["processing", "shipped", "delivered", "cancelled"]),
        payment_id: "PAY-" + i + "-" + Math.random().toString(36).substring(7),
        created_at: new Date()
    });
}
db.orders.insertMany(orders);
print("Orders inserted.");

// 18. OrderItems (20 records)
const orderItems = [];
for (let i = 0; i < 20; i++) {
    orderItems.push({
        order_item_id: genUUID(),
        order_id: getRandom(orderIds),
        variant_id: getRandom(variantIds),
        product_name: "Variant " + i,
        price: getRandomInt(100, 2000),
        quantity: getRandomInt(1, 3)
    });
}
db.order_items.insertMany(orderItems);
print("OrderItems inserted.");

// 19. PDFDownloads (20 records)
const pdfs = [];
for (let i = 0; i < 20; i++) {
    pdfs.push({
        pdf_id: genUUID(),
        user_id: getRandom(userIds),
        order_id: getRandom(orderIds),
        pdf_url: "http://example.com/invoice" + i + ".pdf",
        created_at: new Date()
    });
}
db.pdf_downloads.insertMany(pdfs);
print("PDFDownloads inserted.");

print("Data Generation Completed Successfully!");
