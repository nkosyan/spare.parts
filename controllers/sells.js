// Sell = require('../models/sells');
//
// exports.index = function (req, res) {
//   Sell.get(function (err, sells) {
//         if (err) {
//             res.json({
//               status: "error",
//               message: err,
//             });
//         }
//         res.json({
//             status: "success",
//             message: "Sells retrieved successfully",
//             data: sells,
//         });
//     });
// };
//
// const create = function (req, res) {
//     const sell = new Product();
//     product.name = req.body.name;
//     product.code = req.body.code;
//     product.firm = req.body.firm;
//     product.cost = req.body.cost;
//     product.store_qty = req.body.store_qty;
//     product.shop_qty = req.body.shop_qty;
//
//     product.save(function (err) {
//         if (err) {
//             res.json(err);
//         }
//         res.json({
//             message: 'New product created!',
//             data: product
//         });
//     });
// };
//
// exports.view = function (req, res) {
//     Product.findById(req.params.product_id, function (err, product) {
//     if (err) {
//         res.send(err);
//     }
//     res.json({
//         message: 'Product details loading..',
//         data: product
//     });
//   });
// };
//
// exports.update = function (req, res) {console.log(typeof req.params.product_id, 888)
//     if (req.params.product_id === '-1') {
//       create(req, res);
//       return;
//     }
//     Product.findById(req.params.product_id, function (err, product) {
//         if (err) {
//             res.send(err);
//         }
//         product.name = req.body.name;
//         product.code = req.body.code;
//         product.firm = req.body.firm;
//         product.cost = req.body.cost;
//         product.store_qty = req.body.store_qty;
//         product.shop_qty = req.body.shop_qty;
//
//         product.save(function (err) {
//             console.log(err,product)
//             if (err) {
//                 res.json(err);
//             }
//             res.json({
//                 message: 'Product Info updated',
//                 data: product
//             });
//         });
//     });
// };
//
// exports.delete = function (req, res) {
//     Product.remove({
//         _id: req.params.product_id
//     }, function (err) {
//           if (err) {
//               res.send(err);
//           }
//           res.json({
//               status: "success",
//               message: 'Product deleted'
//           });
//     });
// };
