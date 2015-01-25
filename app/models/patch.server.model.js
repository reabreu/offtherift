'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * Patch Schema
 */
var PatchSchema = new Schema({
	created: {
		type: Date
	},
	update: {
		type: Date,
		default: null
	},
	version: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill version number']
	},
	synched: {
		type: Boolean,
		default: false,
	},
	enabled: {
		type: Boolean,
		default: false,
	},
});

mongoose.model('Patch', PatchSchema);