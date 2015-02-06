'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Champion = mongoose.model('Champion'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, champion;

/**
 * Champion routes tests
 */
describe('Champion CRUD tests', function() {
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

		// Save a user to the test db and create new Champion
		user.save(function() {
			champion = {
				name: 'Champion Name'
			};

			done();
		});
	});

	it('should be able to save Champion instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Champion
				agent.post('/champions')
					.send(champion)
					.expect(200)
					.end(function(championSaveErr, championSaveRes) {
						// Handle Champion save error
						if (championSaveErr) done(championSaveErr);

						// Get a list of Champions
						agent.get('/champions')
							.end(function(championsGetErr, championsGetRes) {
								// Handle Champion save error
								if (championsGetErr) done(championsGetErr);

								// Get Champions list
								var champions = championsGetRes.body;

								// Set assertions
								(champions[0].user._id).should.equal(userId);
								(champions[0].name).should.match('Champion Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Champion instance if not logged in', function(done) {
		agent.post('/champions')
			.send(champion)
			.expect(401)
			.end(function(championSaveErr, championSaveRes) {
				// Call the assertion callback
				done(championSaveErr);
			});
	});

	it('should not be able to save Champion instance if no name is provided', function(done) {
		// Invalidate name field
		champion.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Champion
				agent.post('/champions')
					.send(champion)
					.expect(400)
					.end(function(championSaveErr, championSaveRes) {
						// Set message assertion
						(championSaveRes.body.message).should.match('Please fill Champion name');
						
						// Handle Champion save error
						done(championSaveErr);
					});
			});
	});

	it('should be able to update Champion instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Champion
				agent.post('/champions')
					.send(champion)
					.expect(200)
					.end(function(championSaveErr, championSaveRes) {
						// Handle Champion save error
						if (championSaveErr) done(championSaveErr);

						// Update Champion name
						champion.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Champion
						agent.put('/champions/' + championSaveRes.body._id)
							.send(champion)
							.expect(200)
							.end(function(championUpdateErr, championUpdateRes) {
								// Handle Champion update error
								if (championUpdateErr) done(championUpdateErr);

								// Set assertions
								(championUpdateRes.body._id).should.equal(championSaveRes.body._id);
								(championUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Champions if not signed in', function(done) {
		// Create new Champion model instance
		var championObj = new Champion(champion);

		// Save the Champion
		championObj.save(function() {
			// Request Champions
			request(app).get('/champions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Champion if not signed in', function(done) {
		// Create new Champion model instance
		var championObj = new Champion(champion);

		// Save the Champion
		championObj.save(function() {
			request(app).get('/champions/' + championObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', champion.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Champion instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Champion
				agent.post('/champions')
					.send(champion)
					.expect(200)
					.end(function(championSaveErr, championSaveRes) {
						// Handle Champion save error
						if (championSaveErr) done(championSaveErr);

						// Delete existing Champion
						agent.delete('/champions/' + championSaveRes.body._id)
							.send(champion)
							.expect(200)
							.end(function(championDeleteErr, championDeleteRes) {
								// Handle Champion error error
								if (championDeleteErr) done(championDeleteErr);

								// Set assertions
								(championDeleteRes.body._id).should.equal(championSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Champion instance if not signed in', function(done) {
		// Set Champion user 
		champion.user = user;

		// Create new Champion model instance
		var championObj = new Champion(champion);

		// Save the Champion
		championObj.save(function() {
			// Try deleting Champion
			request(app).delete('/champions/' + championObj._id)
			.expect(401)
			.end(function(championDeleteErr, championDeleteRes) {
				// Set message assertion
				(championDeleteRes.body.message).should.match('User is not logged in');

				// Handle Champion error error
				done(championDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Champion.remove().exec();
		done();
	});
});