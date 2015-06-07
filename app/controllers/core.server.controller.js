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

exports.printRiotActivation = function(req,res){
    res.status(200).send('ac5e52d0-0ad0-482b-abfc-7368e9e9afd3');
}