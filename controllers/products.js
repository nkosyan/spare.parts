Product = require('../models/products');
helpers = require('./helpers');

exports.index = (req, res) => helpers.index(req, res, Product);

exports.view = (req, res) => helpers.view(req, res, Product);

exports.update = (req, res) => {
  if (req.params.id === '-1') {
     const product = new Product();
     product.name = req.body.name;
     product.code = req.body.code;
     product.firm = req.body.firm.key;
     product.cost = req.body.cost;
     product.store_qty = req.body.store_qty;
     product.shop_qty = req.body.shop_qty;
     helpers.save(req, res, product, { ...req.body, _id: product._id, firm: req.body.firm.label });
     return;
  }
  Product.findById(req.params.id, (error, product) => {
    if (error) {
      res.json({ success: false, error });
    }
    product.name = req.body.name;
    product.code = req.body.code;
    product.firm =  req.body.firm.key;
    product.cost = req.body.cost;
    product.store_qty = req.body.store_qty;
    product.shop_qty = req.body.shop_qty;
    helpers.save(req, res, product, { ...req.body, firm: req.body.firm.label });
  });
};

exports.delete = (req, res) => helpers.delete(req, res, Product);
