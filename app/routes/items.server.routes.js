'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var items = require('../../app/controllers/items.server.controller');

	// Items Routes
	
	app.route('/items')
		.get(items.list)
		.post(users.requiresLogin, items.create);

	app.route('/items/:itemId')
		.get(items.read)
		.put(items.update) //@TODO: Rever metodos a chamar deveriam estar iguais abaixo
		.delete(users.requiresLogin, items.hasAuthorization, items.delete);
		
	// Finish by binding the Item middleware
	app.param('itemId', items.itemByID);
};
