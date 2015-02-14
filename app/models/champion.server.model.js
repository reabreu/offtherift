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
	created: {
		type: Date,
		default: Date.now
	},
	version: {
		type: String
	},
	key: {
		type: String,
		default: '',
		required: 'Please fill Champion key',
		trim: true
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill Champion name',
		trim: true
	},
	title: {
		type: String,
		default: '',
		required: 'Please fill Champion title',
		trim: true
	}
}, { strict: false });

mongoose.model('Champion', ChampionSchema);