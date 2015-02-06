'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Gold schema
 */
var GoldSchema = new Schema({
	base:  {
		type: Number
	},
    total: {
    	type: Number
    },
    sell:  {
    	type: Number
    },
    purchasable: {
    	type: Boolean
    }
});

/**
 * Imagem schema
 */
var ImageSchema = new Schema({ 
	full:  {
		type: String
	},
    sprite: {
    	type: String
    },
    group:  {
    	type: String
    },
    x: {
    	type: Number
    },
    y: {
    	type: Number
    },
    w: {
    	type: Number
    },
    h: {
    	type: Number
    }
});

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
	gold: {
		type: 		[GoldSchema]
	},
	group: {
		type: 		String,
		trim: 		true
	},
	description: {
		type: 		String,
		trim: 		true
	},
	sanitizedDescription: {
		type: 		String,
		trim: 		true
	},
	plaintext: {
		type: 		String,
		trim: 		true
	},
	tags:[
		{
			type: String, 
			trim: true
		}
	],
	from: [
		{
			type: String, 
			trim: true
		}
	],
	into: [{
			type: String, 
			trim: true
		}
	],
	image:{
		type: 		[ImageSchema]
	}
});

mongoose.model('Item', ItemSchema);