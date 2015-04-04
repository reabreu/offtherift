'use strict';

/**
 * Module dependencies.
 */
var mongoose 	= require('mongoose'),
	Schema 		= mongoose.Schema;
/**
 * Item Schema
 */
var ItemSchema = new Schema({
	enabled: {
		type: Boolean,
		default: false,
	},
	version : {
		type: 		String,
		required: 	'Please fill version name',
		trim: 		true
	},
	id: {
		type: 		Number,
		required: 	'Please fill id'
	},
	name : {
		type: 		String,
		required: 	'Please fill item name',
		trim: 		true
	},
	group : {
		type: 		String,
		trim: 		true
	},
	customEffect : []
},{ strict: false });

mongoose.model('Item', ItemSchema);