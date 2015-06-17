'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('lodash');

/**
 * Create a Usersstatistic
 */
exports.countUsers = function(req, res) {
    User.count({}, function( err, count){
        res.jsonp({num:count});
    })
};