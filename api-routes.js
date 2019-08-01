const router = require('express').Router();

router.get('/', function (req, res) {
  res.json({
    status: 'API Its Working',
    message: 'Welcome to RESTHub crafted with love!',
  });
});

const product = require('./controllers/products');
const firm = require('./controllers/firms');

router.route('/products').get(product.index);
router.route('/products/:product_id')
  .get(product.view)
  // .patch(product.update)
  .put(product.update)
  .delete(product.delete);

router.route('/firms').get(firm.index);
router.route('/firms/:firm_id')
  .get(firm.view)
  .put(firm.update)
  .delete(firm.delete);

module.exports = router;
