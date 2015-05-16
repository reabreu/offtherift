'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var builds = require('../../app/controllers/builds.server.controller');

	// Builds Routes
	app.route('/builds')
		.get(builds.list)
		.post(users.requiresLogin, builds.create);

	app.route('/builds/popular').get(builds.getPopularBuilds);

	app.route('/builds/statistics').get(builds.getTotalStats);

	app.route('/builds/:buildId')
		.get(users.hasRole(['admin']), builds.read)
		.put(users.requiresLogin, builds.hasAuthorization, builds.update)
		.delete(users.requiresLogin, builds.hasAuthorization, builds.delete);

	// Finish by binding the Build middleware
	app.param('buildId', builds.buildByID);
};
