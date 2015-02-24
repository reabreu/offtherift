'use strict';

/**
 * Public Index
 */
exports.index = function(req, res) {
    var layout = (req.user) ? 'public' : 'teaser';

    res.render('public-index', {
        user: req.user,
        layout: layout,
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