const response = (res, error, data) => res.json(error ? { success: false, error } : { success: true, data });

exports.index = (req, res, model) => model.get((error, data) => response(res, error, data));

exports.save = (req, res, model, data) => model.save(error => response(res, error, data || model));

exports.view = (req, res, model) => model.findById(req.params.id, (error, data) => response(res, error, data));

exports.delete = (req, res, model) => model.remove({ _id: req.params.id }, error => response(res, error));
