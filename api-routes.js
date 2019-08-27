let middleware = require('./middleware');
const router = require('express').Router();

router.get('/', function (req, res) {
  res.json({
    status: 'API Its Working',
    message: 'Welcome to RESTHub crafted with love!',
  });
});

const product = require('./controllers/products');
const firm = require('./controllers/firms');
const sell = require('./controllers/sells');

router.route('/products').get(middleware.checkToken, product.index);
router.route('/products/:id')
  .get(middleware.checkToken, product.view)
  .put(middleware.checkToken, product.update)
  .delete(middleware.checkToken, product.delete);

router.route('/firms').get(middleware.checkToken, firm.index);
router.route('/firms/:id')
  .get(middleware.checkToken, firm.view)
  .put(middleware.checkToken, firm.update)
  .delete(middleware.checkToken, firm.delete);

router.route('/sells')
  .get(sell.index)
  .post(sell.create);
router.route('/sells/:sell_id')
  .get(sell.view)
  .put(sell.update)
  .delete(sell.delete);

module.exports = router;
