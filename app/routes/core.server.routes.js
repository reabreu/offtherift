'use strict';


var basicAuth = require('basic-auth'),
    _ = require('lodash'),
    config = module.exports = _.extend(
      require('../../config/env/all'),
      require('../../config/env/' + process.env.NODE_ENV) || {}
    );

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'ritoplz' && user.pass === 'ritoplz') {
    return next();
  } else {
    return unauthorized(res);
  };
};

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
  var users = require('../../app/controllers/users.server.controller');

  if (config.basicAuth &&
      process.env.NODE_ENV === 'production') {
    app.route('/').get(auth,core.index);
  } else {
    app.route('/').get(core.index);
  }
  app.route('/googleaa5bc3cf7ec54c4e.html').get(core.printGoogleActivation);
  app.route('/riot.txt').get(core.printRiotActivation);

	app.route('/admin').get(users.hasAuthorization(['admin']),users.requiresLogin, core.admin);
};