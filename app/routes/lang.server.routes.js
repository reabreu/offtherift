'use strict';

var lang = require('../../app/controllers/lang.server.controller');

module.exports = function(app) {
	// Routing logic
    app.route('/lang').get(lang.getLang);
};