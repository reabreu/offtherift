'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var patches = require('../../app/controllers/patches.server.controller');

	// Patches Routes
	app.route('/patches')
		.get(patches.list)
		.post(users.requiresLogin, patches.create);

	app.route('/patches/sync').get(patches.checkPatches);
	
	app.route('/patches/:patchId')
		.get(patches.read)
		.put(users.requiresLogin, patches.update)
		.delete(users.requiresLogin, patches.delete);

	app.route('/patches/version/:versionNumber')
		.get(patches.list);
	app.route('/patch/version/:versionNumber')
		.get(patches.read);

	// Finish by binding the Patch middleware
	app.param('patchId', patches.patchByID);
	app.param('versionNumber', patches.patchByVersion);
};
