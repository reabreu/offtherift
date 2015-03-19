'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Rune Schema
 */
var RuneSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Rune name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	enabled: {
		type: Boolean,
		default: false,
	},
	id: {
		type: 		Number,
		required: 	'Please fill id'
	},
	customEffect: []
},{ strict: false });

mongoose.model('Rune', RuneSchema);