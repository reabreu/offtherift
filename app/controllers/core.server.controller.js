'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	var view = ( typeof(req.user) !== 'undefined' ) ? 'index' : 'public-index';
	res.render(view, {
		user: req.user || null,
		request: req
	});
};