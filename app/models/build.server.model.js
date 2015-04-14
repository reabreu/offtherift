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
	displayName: {
		type: String,
		required: 'Please fill in displayName'
	},
	runes_aux: 			{},
	masteries: 			[],
	masteries_aux: 		{},
	snapshot: 			[],
	calculatedStats: 	[],
    facebook:           {
        like_count: {
            type:       Number,
            default:    0
        },
        share_count: {
            type:       Number,
            default:    0
        },
        comment_count: {
            type:       Number,
            default:    0
        }
    },
    lastFacebookUpdate: {
        type: Date,
        default: Date.now
    }
},
{
	strict: 	false,
	minimize: 	false
});

mongoose.model('Build', BuildSchema);
