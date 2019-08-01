const mongoose = require('mongoose');

const firms = mongoose.Schema({
    name: {
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

const Firms = module.exports = mongoose.model('firms', firms);

module.exports.get = function (callback, limit) {
    Firms.find(callback).limit(limit);
};
