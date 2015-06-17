'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users.server.controller');

	// Setting up the users profile api
	//app.route('/users/me').get(users.me);
	app.route('/users').put(users.update);
	//app.route('/users/accounts').delete(users.removeOAuthProvider);

	app.route('/users/count').get(users.countUsers);

	// Setting up the users password api
	//app.route('/users/password').post(users.changePassword);
	//app.route('/auth/forgot').post(users.forgot);
	//app.route('/auth/reset/:token').get(users.validateResetToken);
	//app.route('/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	//app.route('/auth/signup').post(users.signup); // @TODO: Comment line throught teaser period
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	// Setting the facebook oauth routes
	app.route('/auth/facebook/callback').get(users.oauthCallback('facebook'));
	app.route('/auth/facebook').get(passport.authenticate('facebook', {
		scope: ['email']
	}));

	// Setting the twitter oauth routes
	//app.route('/auth/twitter/callback').get(users.oauthCallback('twitter'));
	//app.route('/auth/twitter').get(passport.authenticate('twitter'));

	// Setting the google oauth routes
	//app.route('/auth/google').get(users.getAccess('google'), passport.authenticate('google', {
	//	scope: [
	//		'https://www.googleapis.com/auth/userinfo.profile',
	//		'https://www.googleapis.com/auth/userinfo.email'
	//	]
	//}));
	//app.route('/auth/google/callback').get(users.oauthCallback('google'));

	//Setting the linkedin oauth routes
	//app.route('/auth/linkedin').get(users.getAccess('linkedin'), passport.authenticate('linkedin'));
	//app.route('/auth/linkedin/callback').get(users.oauthCallback('linkedin'));

	//Setting the github oauth routes
	//app.route('/auth/github').get(users.getAccess('github'), passport.authenticate('github'));
	//app.route('/auth/github/callback').get(users.oauthCallback('github'));

	// Hashes
	app.route('/hash').get(users.getRegistrationHash);
	app.route('/hashes').get(users.hasAuthorization(['admin']), users.getRegistrationHashes);
	app.route('/hashes/:input').post(users.hasAuthorization(['admin']), users.generateRegistrationHashes);
	app.route('/hashes/:id').delete(users.hasAuthorization(['admin']), users.removeRegistrationHash);
	app.route('/account/activation/:hash').get(users.activateRegistrationHash);
	app.route('/hashes/unused').get(users.hasUnsedHashes);

	// Validate Hash
	app.route('/subscribe/:email').post(users.subscribeEmail);

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};