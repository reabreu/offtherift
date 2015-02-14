'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Rune = mongoose.model('Rune'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, rune;

/**
 * Rune routes tests
 */
describe('Rune CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Rune
		user.save(function() {
			rune = {
				name: 'Rune Name'
			};

			done();
		});
	});

	it('should be able to save Rune instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rune
				agent.post('/runes')
					.send(rune)
					.expect(200)
					.end(function(runeSaveErr, runeSaveRes) {
						// Handle Rune save error
						if (runeSaveErr) done(runeSaveErr);

						// Get a list of Runes
						agent.get('/runes')
							.end(function(runesGetErr, runesGetRes) {
								// Handle Rune save error
								if (runesGetErr) done(runesGetErr);

								// Get Runes list
								var runes = runesGetRes.body;

								// Set assertions
								(runes[0].user._id).should.equal(userId);
								(runes[0].name).should.match('Rune Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Rune instance if not logged in', function(done) {
		agent.post('/runes')
			.send(rune)
			.expect(401)
			.end(function(runeSaveErr, runeSaveRes) {
				// Call the assertion callback
				done(runeSaveErr);
			});
	});

	it('should not be able to save Rune instance if no name is provided', function(done) {
		// Invalidate name field
		rune.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rune
				agent.post('/runes')
					.send(rune)
					.expect(400)
					.end(function(runeSaveErr, runeSaveRes) {
						// Set message assertion
						(runeSaveRes.body.message).should.match('Please fill Rune name');
						
						// Handle Rune save error
						done(runeSaveErr);
					});
			});
	});

	it('should be able to update Rune instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rune
				agent.post('/runes')
					.send(rune)
					.expect(200)
					.end(function(runeSaveErr, runeSaveRes) {
						// Handle Rune save error
						if (runeSaveErr) done(runeSaveErr);

						// Update Rune name
						rune.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Rune
						agent.put('/runes/' + runeSaveRes.body._id)
							.send(rune)
							.expect(200)
							.end(function(runeUpdateErr, runeUpdateRes) {
								// Handle Rune update error
								if (runeUpdateErr) done(runeUpdateErr);

								// Set assertions
								(runeUpdateRes.body._id).should.equal(runeSaveRes.body._id);
								(runeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Runes if not signed in', function(done) {
		// Create new Rune model instance
		var runeObj = new Rune(rune);

		// Save the Rune
		runeObj.save(function() {
			// Request Runes
			request(app).get('/runes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Rune if not signed in', function(done) {
		// Create new Rune model instance
		var runeObj = new Rune(rune);

		// Save the Rune
		runeObj.save(function() {
			request(app).get('/runes/' + runeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', rune.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Rune instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rune
				agent.post('/runes')
					.send(rune)
					.expect(200)
					.end(function(runeSaveErr, runeSaveRes) {
						// Handle Rune save error
						if (runeSaveErr) done(runeSaveErr);

						// Delete existing Rune
						agent.delete('/runes/' + runeSaveRes.body._id)
							.send(rune)
							.expect(200)
							.end(function(runeDeleteErr, runeDeleteRes) {
								// Handle Rune error error
								if (runeDeleteErr) done(runeDeleteErr);

								// Set assertions
								(runeDeleteRes.body._id).should.equal(runeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Rune instance if not signed in', function(done) {
		// Set Rune user 
		rune.user = user;

		// Create new Rune model instance
		var runeObj = new Rune(rune);

		// Save the Rune
		runeObj.save(function() {
			// Try deleting Rune
			request(app).delete('/runes/' + runeObj._id)
			.expect(401)
			.end(function(runeDeleteErr, runeDeleteRes) {
				// Set message assertion
				(runeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Rune error error
				done(runeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Rune.remove().exec();
		done();
	});
});