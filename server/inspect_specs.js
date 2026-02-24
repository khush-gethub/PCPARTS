const mongoose = require('mongoose');
const { Product } = require('./schema');

async function dump() {
    await mongoose.connect('mongodb://127.0.0.1:27017/pcparts');
    const categories = ['cat_ram', 'cat_graphic_card', 'cat_storage_ssd'];
    for (const cat of categories) {
        const product = await Product.findOne({ category_id: cat });
        if (product) {
            console.log(`--- ${cat} ---`);
            console.log(JSON.stringify(product.specs, null, 2));
        }
    }
    process.exit(0);
}

dump();
