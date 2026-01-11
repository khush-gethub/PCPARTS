const mongoose = require('mongoose');
const { Product } = require('./schema');

async function dump() {
    await mongoose.connect('mongodb://127.0.0.1:27017/pcparts');
    const products = await Product.find({ category_id: /storage/i }).limit(5);
    console.log(JSON.stringify(products, null, 2));
    mongoose.disconnect();
}
dump();
