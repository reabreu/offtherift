'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var patches = require('../../app/controllers/patches.server.controller');

	// Patches Routes
	app.route('/patches').get(patches.list);

	app.route('/patches/:patchId').put(users.requiresLogin, patches.update);

	//sync patches list
	app.route('/patches/sync/').get(patches.checkPatches);

	//sync a specific patch info
	app.route('/patches/syncPatch/:version').get(patches.syncPatchData);

	// Finish by binding the Patch middleware
	app.param('version', patches.patchByVersion);
	app.param('patchId', patches.patchByID);
};
