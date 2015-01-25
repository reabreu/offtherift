'use strict';

/**
 * Module dependencies.
 */
var mongoose 	= require('mongoose'),
    _ 			= require('lodash'),
    config 		= require('../../config/env/all');

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
		}
	],

	generateUrl : function(type)
	{
		var typeObj = this.getType(type);
		return config.app.api.endpoint + config.app.api.region + config.app.api.version + typeObj.url + '?' + config.app.api.api_key + this.params;
	},

	getType: function(type)
	{
		for (var i = 0; i < this.TYPES.length; i++) {
			if (this.TYPES[i].type == type)
				return this.TYPES[i];
		};
		return false;
	},

	setParam : function(params){
		this.params = params;
	}
}