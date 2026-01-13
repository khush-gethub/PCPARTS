const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { Product, ProductVariant, ProductImage, Brand, Stock } = require('./schema');

async function addHMotherboards() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/pcparts');
        console.log('Connected to MongoDB');

        const brands = await Brand.find({ name: { $in: ['ASUS', 'MSI', 'Gigabyte', 'ASRock'] } });
        const brandMap = {};
        brands.forEach(b => brandMap[b.name] = b._id);

        // Fallback IDs if brands don't exist
        const getBrandId = (name) => brandMap[name] || `brand_${name.toLowerCase()}`;

        const hMotherboards = [
            {
                name: 'ASUS Prime H610M-E D4',
                brand: 'ASUS',
                chipset: 'H610',
                socket: 'LGA1700',
                price: 7500,
                image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400'
            },
            {
                name: 'MSI PRO H610M-G DDR4',
                brand: 'MSI',
                chipset: 'H610',
                socket: 'LGA1700',
                price: 7200,
                image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400'
            },
            {
                name: 'Gigabyte H610M S2H',
                brand: 'Gigabyte',
                chipset: 'H610',
                socket: 'LGA1700',
                price: 7800,
                image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400'
            },
            {
                name: 'ASUS Prime H770-PLUS D4',
                brand: 'ASUS',
                chipset: 'H770',
                socket: 'LGA1700',
                price: 15500,
                image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400'
            },
            {
                name: 'MSI MAG H770 GAMING WIFI',
                brand: 'MSI',
                chipset: 'H770',
                socket: 'LGA1700',
                price: 18500,
                image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400'
            }
        ];

        for (const mb of hMotherboards) {
            const productId = `prod_mot_${uuidv4().split('-')[0]}`;

            const product = new Product({
                _id: productId,
                name: mb.name,
                description: `${mb.brand} ${mb.chipset} motherboard with ${mb.socket} socket support.`,
                category_id: 'cat_motherboard',
                brand_id: getBrandId(mb.brand),
                specs: {
                    Socket: mb.socket,
                    Chipset: mb.chipset,
                    FormFactor: 'Micro-ATX',
                    MemorySlots: '2',
                    MaxMemory: '64GB'
                },
                stock_status: 'in_stock'
            });

            await product.save();

            const variantId = `var_${productId}`;
            const variant = new ProductVariant({
                _id: variantId,
                product_id: productId,
                price: mb.price,
                sku: `SKU-${productId.toUpperCase()}`,
                attributes: { color: 'Black' }
            });
            await variant.save();

            const image = new ProductImage({
                _id: `img_${productId}`,
                product_id: productId,
                image_url: mb.image,
                position: 1
            });
            await image.save();

            const stock = new Stock({
                _id: `stock_${variantId}`,
                variant_id: variantId,
                quantity: 50
            });
            await stock.save();

            console.log(`Added: ${mb.name}`);
        }

        console.log('Successfully added 5 H-series motherboards');
        process.exit(0);
    } catch (error) {
        console.error('Error adding motherboards:', error);
        process.exit(1);
    }
}

addHMotherboards();
