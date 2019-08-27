Sell = require('../models/sells');
Product = require('../models/products');

exports.index = function (req, res) {
  Sell.get(function (err, sells) {
        if (err) {
            res.json({
              status: "error",
              message: err,
            });
        }
        res.json({
            status: "success",
            message: "Sells retrieved successfully",
            data: sells,
        });
    });
};

exports.create = function (req, res) {
    const sell = new Sell();
    sell.product = req.body.product;
    sell.cost = req.body.cost;
    sell.price = req.body.price;
    sell.date = new Date();

    Product.findById(req.body.product, function (err, product) {
      if (err) {
        res.send(err);
      }
      product.shop_qty = product.shop_qty - req.body.qty;
      product.save();
    });

    sell.save(function (err) {
        if (err) {
            res.json(err);
        }
        res.json({
            message: 'New sell created!',
            data: sell
        });
    });
};

exports.view = function (req, res) {
    Sell.findById(req.params.sell_id, function (err, sell) {
    if (err) {
        res.send(err);
    }
    res.json({
        message: 'Sell details loading..',
        data: sell
    });
  });
};

exports.update = function (req, res) {
    if (req.params.sell_id === '-1') {
      create(req, res);
      return;
    }
    Sell.findById(req.params.sellId, function (err, sell) {
        if (err) {
            res.send(err);
        }
        sell.productId = req.body.productId;
        sell.price = req.body.price;

        sell.save(function (err) {
            if (err) {
                res.json(err);
            }
            res.json({
                message: 'Sell Info updated',
                data: sell
            });
        });
    });
};

exports.delete = function (req, res) {
    Sell.remove({
        _id: req.params.sell_id
    }, function (err) {
          if (err) {
              res.send(err);
          }
          res.json({
              status: "success",
              message: 'Sell deleted'
          });
    });
};
