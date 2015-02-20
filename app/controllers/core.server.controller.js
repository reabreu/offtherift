'use strict';

/**
 * Public Index
 */
exports.index = function(req, res) {
    res.render('public-index', {
        user: req.user || null,
        request: req
    });
};

/**
 * Admin Index
 */
exports.admin = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};