'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	glob = require('glob');

/**
 * Load app configurations
 */
module.exports = _.extend(
	require('./env/all'),
	require('./env/' + process.env.NODE_ENV) || {}
);

/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = function(globPatterns, removeRoot) {
	// For context switching
	var _this = this;

	// URL paths regex
	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

	// The output array
	var output = [];

	// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
	if (_.isArray(globPatterns)) {
		globPatterns.forEach(function(globPattern) {
			output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
		});
	} else if (_.isString(globPatterns)) {
		if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		} else {
			glob(globPatterns, {
				sync: true
			}, function(err, files) {
				if (removeRoot) {
					files = files.map(function(file) {
						return file.replace(removeRoot, '');
					});
				}

				output = _.union(output, files);
			});
		}
	}

	return output;
};

/**
 * Get the modules JavaScript files
 * @param {string}  env            Environment (admin|public)
 * @param {boolean} includeTests   Include test fileds
 */
module.exports.getJavaScriptAssets = function(env, includeTests) {
	var output = this.getGlobbedFiles(this.env[env].assets.lib.js.concat(this.env[env].assets.js), env + '/');

	// To include tests
	if (includeTests) {
		output = _.union(output, this.getGlobbedFiles(this.env[env].assets.tests));
	}

	return output;
};

/**
 * Get the modules CSS files
 * @param {string} env Environment (admin|public)
 */
module.exports.getCSSAssets = function(env) {
	var output = this.getGlobbedFiles(this.env[env].assets.lib.css.concat(this.env[env].assets.css), env + '/');
	return output;
};