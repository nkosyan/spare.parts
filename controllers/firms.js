Firm = require('../models/firms');

exports.index = function (req, res) {
  Firm.get(function (err, firms) {
        if (err) {
            res.json({
              status: "error",
              message: err,
            });
        }
        res.json({
            status: "success",
            message: "Firm retrieved successfully",
            data: firms,
        });
    });
};

const create = function (req, res) {
    const firm = new Firm();
    firm.name = req.body.name;

    firm.save(function (err) {
        if (err) {
            res.json(err);
        }
        res.json({
            message: 'New firm created!',
            data: firm
        });
    });
};

exports.view = function (req, res) {
    Firm.findById(req.params.firm_id, function (err, firm) {
    if (err) {
        res.send(err);
    }
    res.json({
        message: 'Firm details loading..',
        data: firm
    });
  });
};

exports.update = function (req, res) {
    if (req.params.firm_id === '-1') {
      create(req, res);
      return;
    }
    Firm.findById(req.params.firm_id, function (err, firm) {
        if (err) {
            res.send(err);
        }
        firm.name = req.body.name;
        // firm.update_date = Date.now;

        firm.save(function (err) {
            console.log(err,firm)
            if (err) {
                res.json(err);
            }
            res.json({
                message: 'Firm Info updated',
                data: firm
            });
        });
    });
};

exports.delete = function (req, res) {
    Firm.remove({
        _id: req.params.firm_id
    }, function (err) {
          if (err) {
              res.send(err);
          }
          res.json({
              status: "success",
              message: 'Firm deleted'
          });
    });
};
