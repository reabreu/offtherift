'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Masterie = mongoose.model('Masterie'),
	_ = require('lodash');

/**
 * Create a Masterie
 */
exports.create = function(req, res) {
	var masterie = new Masterie(req.body);
	masterie.user = req.user;

	masterie.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(masterie);
		}
	});
};

/**
 * Show the current Masterie
 */
exports.read = function(req, res) {
	res.jsonp(req.masterie);
};

/**
 * Update a Masterie
 */
exports.update = function(req, res) {
	var masterie = req.masterie ;

	masterie = _.extend(masterie , req.body);

	masterie.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(masterie);
		}
	});
};

/**
 * Delete an Masterie
 */
exports.delete = function(req, res) {
	var masterie = req.masterie ;

	masterie.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(masterie);
		}
	});
};

/**
 * List of Masteries
 */
exports.list = function(req, res) {
	var skip        = req.param('skip');
    var limit       = req.param('limit');
    var version     = req.param('version');
    var name        = req.param('name');
    var enabled     = req.param('enabled');
    var riotId      = req.param('riotId');
    var build       = req.param('build');
    var query       = {};

    var options = {
        skip:       skip,
        limit:      limit
    }

    if (!res.isAdmin)
        query.enabled = true;

    if (version != undefined && version != '')
        query.version = version;

    if (name != undefined)
        query.name = { "$regex": name, "$options": "i" };

    if (enabled != undefined)
        query.enabled = enabled;

    if (riotId != undefined)
        query.id = riotId;

	Masterie.find(query, null, options).sort('name').exec(function(err, masteries) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(masteries);
		}
	});
};

/**
 * Masterie middleware
 */
exports.masterieByID = function(req, res, next, id) {
	Masterie.findById(id).populate('user', 'displayName').exec(function(err, masterie) {
		if (err) return next(err);
		if (! masterie) return next(new Error('Failed to load Masterie ' + id));
		req.masterie = masterie ;
		next();
	});
};

/**
 * Masterie authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.masterie.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
