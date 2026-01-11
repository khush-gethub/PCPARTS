const mongoose = require('mongoose');
const { ReadyMadePC, ReadyMadePCItem, Product, Category, Brand, ProductVariant, Stock } = require('./schema');

async function dump() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/pcparts');
        const pcs = await ReadyMadePC.find().limit(5);
        console.log('--- PCS ---');
        console.log(JSON.stringify(pcs, null, 2));

        if (pcs.length > 0) {
            const items = await ReadyMadePCItem.find({ pc_id: pcs[0]._id });
            console.log('--- ITEMS for PC[0] ---');
            console.log(JSON.stringify(items, null, 2));
        }

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
dump();
