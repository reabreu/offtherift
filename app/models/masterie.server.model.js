'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Masterie Schema
 */
var MasterieSchema = new Schema({
	enabled: {
		type: Boolean,
		default: false,
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill Masterie name',
		trim: true
	},
	version : {
		type: 		String,
		required: 	'Please fill version name',
		trim: 		true
	},
	created: {
		type: Date,
		default: Date.now
	},
	id: {
		type: 		Number,
		required: 	'Please fill id'
	},
	customEffect : []
},{ strict: false });

mongoose.model('Masterie', MasterieSchema);
