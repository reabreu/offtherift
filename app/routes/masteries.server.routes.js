'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var masteries = require('../../app/controllers/masteries.server.controller');

	// Masteries Routes
	app.route('/masteries').get(users.hasRole(['admin']),masteries.list);

	app.route('/masteries/:masterieId')
		.get(masteries.read)
		.put(users.requiresLogin,users.hasAuthorization(['admin']),masteries.update);

	// Finish by binding the Masterie middleware
	app.param('masterieId', masteries.masterieByID);
};
