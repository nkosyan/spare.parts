const mongoose = require('mongoose');

const sells = mongoose.Schema({
    product_id: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const Sells = module.exports = mongoose.model('sells', sells);

module.exports.get = function (callback, limit) {
    Sells.find(callback).limit(limit);
};
