'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Build Schema
 */
var BuildSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Build name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	visible: {
		type: Boolean,
		default: false
	},
	champion_id: {
		type: Number,
		required: 'Please fill champion number'
	},
	version: {
		type: String,
		required: 'Please fill in version',
		trim: true
	},
	runes: {
		mark: [],
		glyph:[],
		seal: [],
		quintessence: []
	},
	masteries: 			[],
	snapshot: 			[]/*,
	calculatedStats: 	[]*/
});

mongoose.model('Build', BuildSchema);