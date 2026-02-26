const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const {
    Product, ProductVariant, Stock, ProductImage,
    Category, Brand
} = require('./schema');

const DATA_DIR = path.join(__dirname, '../DATA');

async function seedData() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/pcparts');
        console.log('✅ Connected to pcparts database');

        const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
        console.log(`📂 Found ${files.length} data files to process.`);

        for (const file of files) {
            console.log(`\n📄 Processing ${file}...`);
            const filePath = path.join(DATA_DIR, file);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            for (const entry of data) {
                const { product, variant, stock, image } = entry;

                // 1. Ensure Category exists (based on ID in product)
                // In these JSONs, IDs like 'cat_cpu' are used directly.
                // We should make sure they exist in the Category collection.
                const categoryNames = {
                    'cat_cpu': 'CPU',
                    'cat_graphic_card': 'Graphic Card',
                    'cat_ram': 'RAM',
                    'cat_cabinet': 'Cabinet',
                    'cat_power_supply': 'Power Supply',
                    'cat_storage_ssd': 'Storage SSD',
                    'cat_cpu_cooler': 'CPU Cooler',
                    'cat_motherboard': 'Motherboard',
                    'cat_monitor': 'Monitor',
                    'cat_accessories': 'Accessories'
                };

                const catName = categoryNames[product.category_id] || product.category_id.replace('cat_', '').toUpperCase();
                await Category.findOneAndUpdate(
                    { _id: product.category_id },
                    { name: catName },
                    { upsert: true, new: true }
                );

                // 2. Ensure Brand exists
                const brandName = product.brand_id.replace('brand_', '').toUpperCase();
                await Brand.findOneAndUpdate(
                    { _id: product.brand_id },
                    { name: brandName },
                    { upsert: true, new: true }
                );

                // 3. Upsert Product
                await Product.findOneAndUpdate(
                    { _id: product._id },
                    product,
                    { upsert: true, new: true }
                );

                // 4. Upsert ProductVariant
                await ProductVariant.findOneAndUpdate(
                    { _id: variant._id },
                    variant,
                    { upsert: true, new: true }
                );

                // 5. Upsert Stock
                await Stock.findOneAndUpdate(
                    { _id: stock._id },
                    stock,
                    { upsert: true, new: true }
                );

                // 6. Upsert Image
                if (image) {
                    await ProductImage.findOneAndUpdate(
                        { _id: image._id },
                        image,
                        { upsert: true, new: true }
                    );
                }

                process.stdout.write('.');
            }
            console.log(`\n✅ Finished ${file}`);
        }

        console.log('\n🌟 Seeding completed successfully!');
    } catch (error) {
        console.error('\n❌ Seeding failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedData();
