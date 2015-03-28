'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	url = require('url'),
	TwitterStrategy = require('passport-twitter').Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users.server.controller'),
	_ = require('lodash');

/**
 * Configure Twitter Strategy
 * @param  {object} options Options
 */
module.exports = function(options) {

	var options = options || {};

	var twitterOptions = _.extend({
		consumerKey: config.twitter.clientID,
		consumerSecret: config.twitter.clientSecret,
		callbackURL: config.twitter.callbackURL,
		passReqToCallback: true
	}, options);

	// Use twitter strategy
	passport.use(new TwitterStrategy(twitterOptions,
		function(req, token, tokenSecret, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
			providerData.token = token;
			providerData.tokenSecret = tokenSecret;

			// Create the user OAuth profile
			var providerUserProfile = {
				displayName: profile.displayName,
				username: profile.username,
				provider: 'twitter',
				providerIdentifierField: 'id_str',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};