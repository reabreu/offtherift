'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Rune = mongoose.model('Rune'),
	_ = require('lodash');

/**
 * Create a Rune
 */
exports.create = function(req, res) {
	var rune = new Rune(req.body);
	rune.user = req.user;

	rune.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rune);
		}
	});
};

/**
 * Show the current Rune
 */
exports.read = function(req, res) {
	res.jsonp(req.rune);
};

/**
 * Update a Rune
 */
exports.update = function(req, res) {
	var rune = req.rune ;

	rune = _.extend(rune , req.body);

	rune.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rune);
		}
	});
};

/**
 * Delete an Rune
 */
exports.delete = function(req, res) {
	var rune = req.rune ;

	rune.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rune);
		}
	});
};

/**
 * List of Runes
 */
exports.list = function(req, res) {
	var skip 		= req.param('skip');
	var limit 		= req.param('limit');
	var version 	= req.param('version');
	var name 		= req.param('name');
	var enabled 	= req.param('enabled');

	var options = {
		skip: 		skip,
		limit: 		limit
	}

	var query = {};

	if (!res.isAdmin)
        query.enabled = true;

	if( version != undefined && version != '')
		query.version = version;

	if( name != undefined)
		query.name = { "$regex": name, "$options": "i" };

	if( enabled != undefined)
		query.enabled = enabled;

	Rune.find(query,null,options).sort('name').exec(function(err, runes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(runes);
		}
	});
};

/**
 * Rune middleware
 */
exports.runeByID = function(req, res, next, id) {
	Rune.findById(id).populate('user', 'displayName').exec(function(err, rune) {
		if (err) return next(err);
		if (! rune) return next(new Error('Failed to load Rune ' + id));
		req.rune = rune ;
		next();
	});
};

/**
 * Rune authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.rune.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
