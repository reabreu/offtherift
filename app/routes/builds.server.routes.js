'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var builds = require('../../app/controllers/builds.server.controller');

	// Builds Routes
	//
	// http://www.offtherift.com/%23!/builds/supporter-zyra/557dfba443ee25e4247540cc
	app.route('/%23!/builds/:buildName/:buildHash').get(builds.redirectToBuild);

	app.route('/builds')
		.get(builds.list)
		.post(users.requiresLogin, builds.create);

	app.route('/builds/count').get(builds.countBuilds);
	app.route('/builds/mostPopular').get(builds.getPopularBuilds);
	app.route('/builds/mostCommented').get(builds.getMostmostCommentedBuilds);
	app.route('/builds/mostShared').get(builds.getMostmostSharedBuilds);
	app.route('/builds/mostLiked').get(builds.getMostmostLikedBuilds);

	app.route('/builds/statistics').get(builds.getTotalStats);

	app.route('/builds/:buildId')
		.get(users.hasRole(['admin']), builds.read)
		.put(users.requiresLogin, builds.hasAuthorization, builds.update)
		.delete(users.requiresLogin, builds.hasAuthorization, builds.delete);

	// Finish by binding the Build middleware
	app.param('buildId', builds.buildByID);
};
