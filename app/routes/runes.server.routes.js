'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var runes = require('../../app/controllers/runes.server.controller');

	// Runes Routes
	app.route('/runes')
		.get(runes.list)
		.post(users.requiresLogin, runes.create);

	app.route('/runes/:runeId')
		.get(runes.read)
		.put(users.requiresLogin, runes.hasAuthorization, runes.update)
		.delete(users.requiresLogin, runes.hasAuthorization, runes.delete);

	// Finish by binding the Rune middleware
	app.param('runeId', runes.runeByID);
};
