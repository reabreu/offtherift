'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var champions = require('../../app/controllers/champions.server.controller');

	// Champions Routes
	app.route('/champions')
		.get(champions.list)
		.post(users.requiresLogin, champions.create);

	app.route('/champions/:championId')
		.get(champions.read)
		.put(champions.update)
		.delete(users.requiresLogin, champions.hasAuthorization, champions.delete);

	// Finish by binding the Champion middleware
	app.param('championId', champions.championByID);
};
