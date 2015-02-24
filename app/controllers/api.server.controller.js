'use strict';

/**
 * Module dependencies.
 */
var mongoose 	= require('mongoose'),
    _ 			= require('lodash'),
    config 		= require('../../config/env/all'),
    https       = require('https'),
    $q          = require('q');

/**
 * Create a Api
 */
module.exports = {
	/**
	 * Types Constants
	 * @type {Number}
	 */
	params: 	'',
	PATCH:  	1,
	CHAMPION: 	2,
	ITEM: 		3,
	RUNE: 		4,
	MASTERIE:   5,


	/**
	 * Types Configurations
	 * @type {Array}
	 */
	TYPES: [
		{
			type: 1,
			url: '/versions'
		},
		{
			type: 2,
			url: '/champion'
		},
		{
			type: 3,
			url: '/item'
		},
		{
			type: 4,
			url: '/rune'
		},
		{
			type: 5,
			url: '/mastery'
		}
	],
	/**
	 * Generates LOL API Url
	 * @param  {integer} type Type Identification
	 * @return {string}  Url
	 */
	generateUrl : function(type)
	{
		var typeObj = this.getType(type);
		return config.app.api.endpoint + config.app.api.region + config.app.api.version + typeObj.url + '?' + config.app.api.api_key + this.params;
	},
	/**
	 * Get type options
	 * @param  {integer} type Type Identification
	 * @return {object}       Type Object
	 */
	getType: function(type)
	{
		for (var i = 0; i < this.TYPES.length; i++) {
			if (this.TYPES[i].type == type)
				return this.TYPES[i];
		};
		return false;
	},
	/**
	 * Set url extra parameters
	 * @param {object} params Parameters
	 */
	setParam : function(params)
	{
		return this.params = params;
	},
	/**
	 * Request data to API Url
     * @param  {integer} type   Type Identification
	 * @param  {object}  params Extra Parameters
	 * @return {q}              Promise
	 */
	requestData: function(type)
	{
		var deferred = $q.defer();
		var url      = this.generateUrl(type);
		https.get(url, function(res) {
		    var body = '';

		    res.on('data', function(chunk) {
		        body += chunk;
		    });

		    res.on('end', function() {
                deferred.resolve({response: res, data: JSON.parse(body)});
		    });

		}).on('error', function(e) {
		    deferred.reject(e);
	    });

		return deferred.promise;
	},
}