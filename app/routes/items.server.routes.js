'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var items = require('../../app/controllers/items.server.controller');

	// Items Routes

	app.route('/items').get(users.hasRole(['admin']),items.list);

	app.route('/items/:itemId')
		.get(items.read)
		.put(users.requiresLogin,users.hasAuthorization(['admin']),items.update);

	// Finish by binding the Item middleware
	app.param('itemId', items.itemByID);
};
