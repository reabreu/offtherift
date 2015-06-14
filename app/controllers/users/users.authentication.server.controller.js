'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	async = require('async'),
    RegistrationHash = mongoose.model('RegistrationHash'),
    hashes = require('./users.hashes.server.controller');

/**
 * Signup
 */
exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Init Variables
	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;

	// Then save the user
	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	});
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	})(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
	return function(req, res, next) {

		var loginUrl  = '/#!/login';

		passport.authenticate(strategy, function(err, user, redirectURL) {

			if (err || !user) {
				return res.redirect(loginUrl);
			}

            // new user from social network
            if (user && redirectURL) {
                return res.redirect(redirectURL);
            }

			req.login(user, function(err) {
				if (err) {
					return res.redirect(loginUrl);
				}

				return res.redirect(redirectURL || '/');
			});


		})(req, res, next);
	};
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
	if (!req.user) {
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerUserProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define a search query to find existing user with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};

		async.waterfall([
            function (aDone) { // find user with social account email
                User.findOne(searchQuery, function(err, user) {
                	if (err) {
                		return done(err);
                	} else {
                		aDone(err, user);
                	}
                });
            },
            function (user, aDone, err) { // creates a need user with social data
                if (!user) {
                	var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

                	User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
                		user = new User({
                			firstName: providerUserProfile.firstName,
                			lastName: providerUserProfile.lastName,
                			username: availableUsername,
                			displayName: providerUserProfile.displayName,
                			email: providerUserProfile.email,
                			provider: providerUserProfile.provider,
                			providerData: providerUserProfile.providerData
                		});

                		// And save the user and creates user session cookie
                		user.save(function(err) {
                			aDone(err, user);
                		});
                	});
                } else { // creates user session cookie
                	aDone(err, user);
                }
            },
            function (user, aDone, err) { // verifies if user is activated
                if (user) {
                	var query = {
                		email: user.email
                	};

                	RegistrationHash.findOne(query, null, function(err, userHash) {
                		if (userHash) {
                			if (userHash.hash &&
                				userHash.activated) { // user registered and activated
                				return done(err, user);
                			} else if (userHash.hash &&
                				!userHash.activated) { // user needs to activate his account
                                return done(err, user, '/#!/account/evaluate/activation');
                			} else if (!userHash.hash) { // user needs a hash
                				return done(err, user, '/#!/account/evaluate/hash');
                			}
                		} else { // user hash not found
                            var hash = new RegistrationHash({
                                email: user.email
                            });

                            hash.save(function() {
                                return done(err, user, '/#!/account/evaluate/new');
                            });
                		}
                	});

                } else {
                	console.log('ERROR');
                	done(err);
                }
            },
            hashes.emailHashRegistration,
            function (result, options, aDone) {
            	console.log(result);
            	// 'Sorry! There are no more hashes available for today. We will keep your email so we can contact you later.'
            },
        ], function(err) {
	        if (err) return next(err);
	    });

	} else {
		// User is already logged in, join the provider data to the existing user
		var user = req.user;

		// Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!user.additionalProvidersData) user.additionalProvidersData = {};
			user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');

			// And save the user
			user.save(function(err) {
				return done(err, user, '/#!/settings/accounts');
			});
		} else {
			return done(new Error('User is already connected using this provider'), user);
		}
	}
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
	var user = req.user;
	var provider = req.param('provider');

	if (user && provider) {
		// Delete the additional provider
		if (user.additionalProvidersData[provider]) {
			delete user.additionalProvidersData[provider];

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');
		}

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	}
};