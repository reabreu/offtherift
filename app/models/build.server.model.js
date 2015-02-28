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
	}
});

mongoose.model('Build', BuildSchema);