'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	RegistrationHashes = mongoose.model('RegistrationHashes');

/**
 * Globals
 */
var user, registrationHashes;

/**
 * Unit tests
 */
describe('Registration hashes Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			registrationHashes = new RegistrationHashes({
				// Add model fields
				// ...
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return registrationHashes.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		RegistrationHashes.remove().exec();
		User.remove().exec();

		done();
	});
});