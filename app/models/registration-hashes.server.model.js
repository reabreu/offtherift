'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * RegistrationHash Schema
 */
var RegistrationHashSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    hash: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    activated: {
        type: Date
    },
    user: {
        ref: 'User',
        type: Schema.ObjectId
    },
});

mongoose.model('RegistrationHash', RegistrationHashSchema);