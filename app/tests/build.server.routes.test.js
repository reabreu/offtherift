'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Build = mongoose.model('Build'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, build;

/**
 * Build routes tests
 */
describe('Build CRUD tests', function() {
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

		// Save a user to the test db and create new Build
		user.save(function() {
			build = {
				name: 'Build Name'
			};

			done();
		});
	});

	it('should be able to save Build instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Build
				agent.post('/builds')
					.send(build)
					.expect(200)
					.end(function(buildSaveErr, buildSaveRes) {
						// Handle Build save error
						if (buildSaveErr) done(buildSaveErr);

						// Get a list of Builds
						agent.get('/builds')
							.end(function(buildsGetErr, buildsGetRes) {
								// Handle Build save error
								if (buildsGetErr) done(buildsGetErr);

								// Get Builds list
								var builds = buildsGetRes.body;

								// Set assertions
								(builds[0].user._id).should.equal(userId);
								(builds[0].name).should.match('Build Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Build instance if not logged in', function(done) {
		agent.post('/builds')
			.send(build)
			.expect(401)
			.end(function(buildSaveErr, buildSaveRes) {
				// Call the assertion callback
				done(buildSaveErr);
			});
	});

	it('should not be able to save Build instance if no name is provided', function(done) {
		// Invalidate name field
		build.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Build
				agent.post('/builds')
					.send(build)
					.expect(400)
					.end(function(buildSaveErr, buildSaveRes) {
						// Set message assertion
						(buildSaveRes.body.message).should.match('Please fill Build name');
						
						// Handle Build save error
						done(buildSaveErr);
					});
			});
	});

	it('should be able to update Build instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Build
				agent.post('/builds')
					.send(build)
					.expect(200)
					.end(function(buildSaveErr, buildSaveRes) {
						// Handle Build save error
						if (buildSaveErr) done(buildSaveErr);

						// Update Build name
						build.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Build
						agent.put('/builds/' + buildSaveRes.body._id)
							.send(build)
							.expect(200)
							.end(function(buildUpdateErr, buildUpdateRes) {
								// Handle Build update error
								if (buildUpdateErr) done(buildUpdateErr);

								// Set assertions
								(buildUpdateRes.body._id).should.equal(buildSaveRes.body._id);
								(buildUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Builds if not signed in', function(done) {
		// Create new Build model instance
		var buildObj = new Build(build);

		// Save the Build
		buildObj.save(function() {
			// Request Builds
			request(app).get('/builds')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Build if not signed in', function(done) {
		// Create new Build model instance
		var buildObj = new Build(build);

		// Save the Build
		buildObj.save(function() {
			request(app).get('/builds/' + buildObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', build.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Build instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Build
				agent.post('/builds')
					.send(build)
					.expect(200)
					.end(function(buildSaveErr, buildSaveRes) {
						// Handle Build save error
						if (buildSaveErr) done(buildSaveErr);

						// Delete existing Build
						agent.delete('/builds/' + buildSaveRes.body._id)
							.send(build)
							.expect(200)
							.end(function(buildDeleteErr, buildDeleteRes) {
								// Handle Build error error
								if (buildDeleteErr) done(buildDeleteErr);

								// Set assertions
								(buildDeleteRes.body._id).should.equal(buildSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Build instance if not signed in', function(done) {
		// Set Build user 
		build.user = user;

		// Create new Build model instance
		var buildObj = new Build(build);

		// Save the Build
		buildObj.save(function() {
			// Try deleting Build
			request(app).delete('/builds/' + buildObj._id)
			.expect(401)
			.end(function(buildDeleteErr, buildDeleteRes) {
				// Set message assertion
				(buildDeleteRes.body.message).should.match('User is not logged in');

				// Handle Build error error
				done(buildDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Build.remove().exec();
		done();
	});
});