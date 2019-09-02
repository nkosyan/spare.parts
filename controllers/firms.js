Firm = require('../models/firms');
helpers = require('./helpers');

exports.index = (req, res) => helpers.index(req, res, Firm);

exports.view = (req, res) => helpers.view(req, res, Firm);

exports.update = (req, res) => {
  if (req.params.id === '-1') {
    const firm = new Firm();

    firm.name = req.body.name;
    helpers.save(req, res, firm);
    return;
  }
  Firm.findById(req.params.id, (error, firm) => {
    if (error) {
      res.json({ success: false, error });
    }
    firm.name = req.body.name;
    helpers.save(req, res, firm);
  });
};

exports.delete = (req, res) => helpers.delete(req, res, Firm);
