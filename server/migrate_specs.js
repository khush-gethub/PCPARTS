const mongoose = require('mongoose');
const { Product } = require('./schema');

async function migrate() {
    await mongoose.connect('mongodb://127.0.0.1:27017/pcparts');

    const products = await Product.find({
        category_id: { $in: ['cat_ram', 'cat_graphic_card', 'cat_storage_ssd'] }
    });

    console.log(`Found ${products.length} products to check.`);

    for (const p of products) {
        if (!p.specs) p.specs = {};

        const catId = typeof p.category_id === 'object' ? p.category_id._id : p.category_id;

        // Force update to numeric values
        if (catId === 'cat_ram') {
            p.specs['Sequential Read'] = 64000;
            p.specs['Sequential Write'] = 64000;
        } else if (catId === 'cat_graphic_card') {
            p.specs['Sequential Read'] = 900000;
            p.specs['Sequential Write'] = 900000;
        } else if (catId === 'cat_storage_ssd') {
            p.specs['Sequential Read'] = 3500;
            p.specs['Sequential Write'] = 3000;
        }

        p.markModified('specs');
        await p.save();
        console.log(`Updated specs for product: ${p.name}`);
    }

    console.log('Migration complete.');
    process.exit(0);
}

migrate();
