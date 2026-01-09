// MongoDB Shell Script to Create Database and Insert Dummy Data
// Usage: mongosh < mongo_raw_query.js
// OR Paste into MongoDB Compass Shell

// Helper function for UUIDs (v4 compatible)
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// --- 0. Cleanup ---
print("Cleaning up old collections...");
db.users.drop();
db.addresses.drop();
db.categories.drop();
db.brands.drop();
db.products.drop();
db.productvariants.drop();
db.stocks.drop();
db.productimages.drop();
db.benchmarks.drop();
db.pcbuildercompatibilities.drop();
db.readymadepcs.drop();
db.readymadepcitems.drop();
db.coupons.drop();
db.usercoupons.drop();
db.carts.drop();
db.cartitems.drop();
db.orders.drop();
db.orderitems.drop();
db.pdfdownloads.drop();

print("Generating Data...");

// --- 1. Categories ---
var categories = ['CPUs', 'Graphics Cards', 'Motherboards', 'Memory', 'Storage', 'Power Supplies', 'Cases'];
var categoryDocs = [];
for (var i = 0; i < categories.length; i++) {
    categoryDocs.push({
        category_id: uuidv4(),
        name: categories[i]
    });
}
db.categories.insertMany(categoryDocs);
print("Created " + categoryDocs.length + " Categories");

// --- 2. Brands ---
var brands = ['Intel', 'AMD', 'NVIDIA', 'ASUS', 'MSI', 'Corsair', 'Samsung', 'Kingston'];
var brandDocs = [];
for (var i = 0; i < brands.length; i++) {
    brandDocs.push({
        brand_id: uuidv4(),
        name: brands[i]
    });
}
db.brands.insertMany(brandDocs);
print("Created " + brandDocs.length + " Brands");

// --- 3. Products, Variants, Stock, Images, Benchmarks ---
var productNames = [
    'Core i9-13900K', 'Ryzen 9 7950X', 'GeForce RTX 4090', 'Radeon RX 7900 XTX',
    'ROG Maximus Z790', 'MPG B650 Carbon', 'Vengeance RGB 32GB', '990 PRO 2TB',
    'RM1000x Shift', 'H9 Flow', 'Core i7-13700K', 'Ryzen 7 7800X3D', 'GeForce RTX 4080',
    'Dominator Platinum', '980 PRO 1TB'
];

var productDocs = [];
var variantDocs = [];
var stockDocs = [];
var imageDocs = [];
var benchmarkDocs = [];

for (var i = 0; i < productNames.length; i++) {
    var name = productNames[i];
    var category = getRandomArrayElement(categoryDocs);
    var brand = getRandomArrayElement(brandDocs);
    var pid = uuidv4();

    // Product
    productDocs.push({
        product_id: pid,
        category_id: category.category_id,
        brand_id: brand.brand_id,
        name: name,
        description: "High performance " + name + " for gaming and productivity.",
        specs: { cores: getRandomInt(8, 24), speed: getRandomInt(3, 5) + "GHz" }
    });

    // Variant
    var vid = uuidv4();
    variantDocs.push({
        variant_id: vid,
        product_id: pid,
        name: name + " Standard",
        sku: "SKU-" + getRandomInt(1000, 9999),
        price: getRandomInt(100, 2000),
        discount_price: null,
        stock_status: 'in_stock',
        weight: getRandomInt(100, 2000)
    });

    // Stock
    stockDocs.push({
        stock_id: uuidv4(),
        variant_id: vid,
        quantity: getRandomInt(10, 100),
        updated_at: new Date()
    });

    // Image
    imageDocs.push({
        image_id: uuidv4(),
        product_id: pid,
        image_url: "/assets/" + name.replace(/\s+/g, '-').toLowerCase() + ".jpg",
        position: 1
    });

    // Benchmark (First 5 only)
    if (i < 5) {
        benchmarkDocs.push({
            benchmark_id: uuidv4(),
            product_id: pid,
            name: 'Cinebench R23',
            score: getRandomInt(15000, 40000),
            details: { multi_core: true }
        });
    }
}

db.products.insertMany(productDocs);
db.productvariants.insertMany(variantDocs);
db.stocks.insertMany(stockDocs);
db.productimages.insertMany(imageDocs);
db.benchmarks.insertMany(benchmarkDocs);

print("Created " + productDocs.length + " Products and related data");


// --- 9. Users & Addresses ---
var userDocs = [];
var addressDocs = [];

for (var i = 1; i <= 5; i++) {
    var uid = uuidv4();
    userDocs.push({
        user_id: uid,
        name: "User " + i,
        email: "user" + i + "@example.com",
        password_: "hashed_password_123",
        phone: "123456789" + i,
        role: "user",
        created_at: new Date()
    });

    addressDocs.push({
        address_id: uuidv4(),
        user_id: uid,
        line1: getRandomInt(10, 999) + " Main St",
        line2: "",
        city: "Tech City",
        state: "State",
        pincode: "12345",
        country: "Country"
    });
}
db.users.insertMany(userDocs);
db.addresses.insertMany(addressDocs);
print("Created " + userDocs.length + " Users and Addresses");

// --- Compatibility ---
if (productDocs.length > 1) {
    db.pcbuildercompatibilities.insertOne({
        compat_id: uuidv4(),
        product_id: productDocs[0].product_id,
        compatible_with_product_id: productDocs[1].product_id,
        rule: 'Requires BIOS update'
    });
    print("Created Compatibility");
}

// --- ReadyMadePC ---
var pcId = uuidv4();
db.readymadepcs.insertOne({
    pc_id: pcId,
    name: 'Ultimate Gaming Beast',
    price: 3500,
    category: 'High-End',
    image: '/assets/pc1.jpg',
    Image2: '/assets/pc1-side.jpg',
    Image3: '/assets/pc1-internal.jpg'
});

db.readymadepcitems.insertOne({
    item_id: uuidv4(),
    pc_id: pcId,
    product_id: productDocs[0].product_id,
    variant_id: variantDocs[0].variant_id
});
print("Created ReadyMadePC");

// --- Coupons ---
var couponId = uuidv4();
db.coupons.insertOne({
    coupon_id: couponId,
    code: 'WELCOME2026',
    discount_value: 10,
    min_order_amount: 100,
    expires_at: new Date('2026-12-31'),
    usage_limit: 100,
    created_at: new Date()
});

db.usercoupons.insertOne({
    user_coupon_id: uuidv4(),
    user_id: userDocs[0].user_id,
    coupon_id: couponId,
    used_at: new Date()
});
print("Created Coupons");

// --- Cart, Orders, PDF ---
var cartId = uuidv4();
db.carts.insertOne({
    cart_id: cartId,
    user_id: userDocs[0].user_id,
    created_at: new Date(),
    updated_at: new Date()
});

db.cartitems.insertOne({
    cart_item_id: uuidv4(),
    cart_id: cartId,
    variant_id: variantDocs[0].variant_id,
    quantity: 1,
    price_snapshot: 500
});

var orderId = uuidv4();
db.orders.insertOne({
    order_id: orderId,
    user_id: userDocs[0].user_id,
    address_id: addressDocs[0].address_id,
    total_price: 1500,
    payment_status: 'paid',
    order_status: 'processing',
    payment_id: 'PAY-123',
    created_at: new Date()
});

db.orderitems.insertOne({
    order_item_id: uuidv4(),
    order_id: orderId,
    variant_id: variantDocs[0].variant_id,
    product_name: productDocs[0].name,
    price: 500,
    quantity: 1
});

db.pdfdownloads.insertOne({
    pdf_id: uuidv4(),
    user_id: userDocs[0].user_id,
    order_id: orderId,
    pdf_url: '/invoices/' + orderId + '.pdf',
    created_at: new Date()
});

print("Created Cart, Order, and Transactions");
print("✅ ALL DONE: Database 'pcstore' populated.");
