'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var runes = require('../../app/controllers/runes.server.controller');

	// Runes Routes
	app.route('/runes')
		.get(users.hasRole(['admin']),runes.list);

	app.route('/runes/:runeId')
		.get(runes.read)
		.put(users.requiresLogin,users.hasAuthorization(['admin']),runes.update);

	// Finish by binding the Rune middleware
	app.param('runeId', runes.runeByID);
};
