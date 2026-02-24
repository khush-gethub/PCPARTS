const mongoose = require('mongoose');
const { Stock } = require('./schema');

const { ProductVariant } = require('./schema');

async function checkStock() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/pcparts');
        const lowStatus = await ProductVariant.find({ stock_status: 'low_stock' });
        console.log('LOW_STATUS_VARIANTS:', JSON.stringify(lowStatus.map(v => ({ id: v._id, name: v.name, status: v.stock_status }))));

        const smallQty = await Stock.find({ quantity: { $lte: 10 } });
        console.log('SMALL_QTY_STOCKS:', JSON.stringify(smallQty.map(s => ({ id: s._id, variant_id: s.variant_id, qty: s.quantity }))));

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

checkStock();
