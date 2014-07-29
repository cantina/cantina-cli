module.exports = function (app) {
  var controller = app.controller()
    , conf = app.conf.get('app');

  controller.get(['/'], index);

  function index (req, res, next) {
    res.vars.title = conf.title;
    res.vars.user = req.user;
    res.render('home', res.vars);
  }

  return controller;
};
