'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users.server.controller');

	// Setting up the users profile api
	app.route('/users').put(users.update);
	app.route('/users/count').get(users.countUsers);

	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	// Setting the facebook oauth routes
	app.route('/auth/facebook/callback').get(users.oauthCallback('facebook'));
	app.route('/auth/facebook').get(passport.authenticate('facebook', {
		scope: ['email']
	}));

	// Hashes
	app.route('/hash').get(users.getRegistrationHash);
	app.route('/hashes').get(users.hasAuthorization(['admin']), users.getRegistrationHashes);
	app.route('/hashes/:input').post(users.hasAuthorization(['admin']), users.generateRegistrationHashes);
	app.route('/hashes/:id').delete(users.hasAuthorization(['admin']), users.removeRegistrationHash);
	app.route('/account/activation/:hash').get(users.activateRegistrationHash);
	app.route('/hashes/unused').get(users.hasUnsedHashes);
	app.route('/hashes/unSet').get(users.countUnsetHashes);

	// Validate Hash
	app.route('/subscribe/:email').post(users.subscribeEmail);

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};