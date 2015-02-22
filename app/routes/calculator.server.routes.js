'use strict';

module.exports = function(app) {
	var calculator = require('../../app/controllers/calculator.server.controller');

	// Champions Routes
	app.route('/calculate').post(calculator.calculate);
};