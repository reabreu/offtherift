'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Champion Schema
 */
var ChampionSchema = new Schema({
	enabled: {
		type: Boolean,
		default: false,
	},
	created: {
		type: Date,
		default: Date.now
	},
	version: {
		type: String
	},
	id: {
		type: 		Number,
		required: 	'Please fill id'
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill Champion name',
		trim: true
	},
	spells: []
}, { strict: false });

mongoose.model('Champion', ChampionSchema);