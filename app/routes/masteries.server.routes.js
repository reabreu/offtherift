'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var masteries = require('../../app/controllers/masteries.server.controller');

	// Masteries Routes
	app.route('/masteries')
		.get(masteries.list)
		.post(users.requiresLogin, masteries.create);

	app.route('/masteries/:masterieId')
		.get(masteries.read)
		.put(masteries.update)
		.delete(users.requiresLogin, masteries.hasAuthorization, masteries.delete);

	// Finish by binding the Masterie middleware
	app.param('masterieId', masteries.masterieByID);
};
