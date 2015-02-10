'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');

/**
 * Calculate
 */
exports.processStats = function(req, res) {
	var request = req.body;
	res.jsonp(request);
};