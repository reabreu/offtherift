'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Build = mongoose.model('Build'),
	_ = require('lodash');

/**
 * Create a Build
 */
exports.create = function(req, res) {
	var build = new Build(req.body);
	build.user = req.user;

	build.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(build);
		}
	});
};

/**
 * Show the current Build
 */
exports.read = function(req, res) {
	res.jsonp(req.build);
};

/**
 * Update a Build
 */
exports.update = function(req, res) {
	var build = req.build ;

	build = _.extend(build , req.body);

	build.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(build);
		}
	});
};

/**
 * Delete an Build
 */
exports.delete = function(req, res) {
	var build = req.build ;

	build.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(build);
		}
	});
};

/**
 * List of Builds
 */
exports.list = function(req, res) { 
	Build.find().sort('-created').populate('user', 'displayName').exec(function(err, builds) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(builds);
		}
	});
};

/**
 * Build middleware
 */
exports.buildByID = function(req, res, next, id) { 
	Build.findById(id).populate('user', 'displayName').exec(function(err, build) {
		if (err) return next(err);
		if (! build) return next(new Error('Failed to load Build ' + id));
		req.build = build ;
		next();
	});
};

/**
 * Build authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.build.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
