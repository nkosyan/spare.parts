const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Products = require('./products');
const Firms = require('./firms');

const sells = Schema({
    product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: Products,
    },
    cost: {
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
    Sells.find(callback).limit(limit)
      .populate({
          path: 'product',
          populate: { path: 'firm', select: 'name', model: Firms },
          select: 'name code firm'
    }).limit(limit);
};
