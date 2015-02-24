'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var champions = require('../../app/controllers/champions.server.controller');

	// Champions Routes
	app.route('/champions')
		.get(champions.list);

	app.route('/champions/:championId')
		.get(champions.read)
		.put(users.requiresLogin,users.hasAuthorization(['admin']),champions.update);

	// Finish by binding the Champion middleware
	app.param('championId', champions.championByID);
};
