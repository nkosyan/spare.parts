const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Firms = require('./firms');

const products = Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    firm: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: Firms,
    },
    cost: {
        type: String,
        required: true
    },
    store_qty: {
        type: String,
        required: true
    },
    shop_qty: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    },
    update_date: {
        type: Date,
        default: Date.now
    },
});

const Products = module.exports = mongoose.model('products', products);


module.exports.get = function (callback, limit) {
    Products.find(callback).populate({ path: 'firm', select: 'name' }).limit(limit);
};
