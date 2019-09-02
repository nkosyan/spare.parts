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

module.exports.get = function (callback, quesry = {}) {
  const { orderBy = 'update_date', order = -1, limit, filters } = quesry;
    console.log(callback, 555)
    Firms.find(callback).sort({ [orderBy]: order }).limit(limit);
};
