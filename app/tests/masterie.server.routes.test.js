'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Masterie = mongoose.model('Masterie'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, masterie;

/**
 * Masterie routes tests
 */
describe('Masterie CRUD tests', function() {
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

		// Save a user to the test db and create new Masterie
		user.save(function() {
			masterie = {
				name: 'Masterie Name'
			};

			done();
		});
	});

	it('should be able to save Masterie instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Masterie
				agent.post('/masteries')
					.send(masterie)
					.expect(200)
					.end(function(masterieSaveErr, masterieSaveRes) {
						// Handle Masterie save error
						if (masterieSaveErr) done(masterieSaveErr);

						// Get a list of Masteries
						agent.get('/masteries')
							.end(function(masteriesGetErr, masteriesGetRes) {
								// Handle Masterie save error
								if (masteriesGetErr) done(masteriesGetErr);

								// Get Masteries list
								var masteries = masteriesGetRes.body;

								// Set assertions
								(masteries[0].user._id).should.equal(userId);
								(masteries[0].name).should.match('Masterie Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Masterie instance if not logged in', function(done) {
		agent.post('/masteries')
			.send(masterie)
			.expect(401)
			.end(function(masterieSaveErr, masterieSaveRes) {
				// Call the assertion callback
				done(masterieSaveErr);
			});
	});

	it('should not be able to save Masterie instance if no name is provided', function(done) {
		// Invalidate name field
		masterie.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Masterie
				agent.post('/masteries')
					.send(masterie)
					.expect(400)
					.end(function(masterieSaveErr, masterieSaveRes) {
						// Set message assertion
						(masterieSaveRes.body.message).should.match('Please fill Masterie name');
						
						// Handle Masterie save error
						done(masterieSaveErr);
					});
			});
	});

	it('should be able to update Masterie instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Masterie
				agent.post('/masteries')
					.send(masterie)
					.expect(200)
					.end(function(masterieSaveErr, masterieSaveRes) {
						// Handle Masterie save error
						if (masterieSaveErr) done(masterieSaveErr);

						// Update Masterie name
						masterie.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Masterie
						agent.put('/masteries/' + masterieSaveRes.body._id)
							.send(masterie)
							.expect(200)
							.end(function(masterieUpdateErr, masterieUpdateRes) {
								// Handle Masterie update error
								if (masterieUpdateErr) done(masterieUpdateErr);

								// Set assertions
								(masterieUpdateRes.body._id).should.equal(masterieSaveRes.body._id);
								(masterieUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Masteries if not signed in', function(done) {
		// Create new Masterie model instance
		var masterieObj = new Masterie(masterie);

		// Save the Masterie
		masterieObj.save(function() {
			// Request Masteries
			request(app).get('/masteries')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Masterie if not signed in', function(done) {
		// Create new Masterie model instance
		var masterieObj = new Masterie(masterie);

		// Save the Masterie
		masterieObj.save(function() {
			request(app).get('/masteries/' + masterieObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', masterie.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Masterie instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Masterie
				agent.post('/masteries')
					.send(masterie)
					.expect(200)
					.end(function(masterieSaveErr, masterieSaveRes) {
						// Handle Masterie save error
						if (masterieSaveErr) done(masterieSaveErr);

						// Delete existing Masterie
						agent.delete('/masteries/' + masterieSaveRes.body._id)
							.send(masterie)
							.expect(200)
							.end(function(masterieDeleteErr, masterieDeleteRes) {
								// Handle Masterie error error
								if (masterieDeleteErr) done(masterieDeleteErr);

								// Set assertions
								(masterieDeleteRes.body._id).should.equal(masterieSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Masterie instance if not signed in', function(done) {
		// Set Masterie user 
		masterie.user = user;

		// Create new Masterie model instance
		var masterieObj = new Masterie(masterie);

		// Save the Masterie
		masterieObj.save(function() {
			// Try deleting Masterie
			request(app).delete('/masteries/' + masterieObj._id)
			.expect(401)
			.end(function(masterieDeleteErr, masterieDeleteRes) {
				// Set message assertion
				(masterieDeleteRes.body.message).should.match('User is not logged in');

				// Handle Masterie error error
				done(masterieDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Masterie.remove().exec();
		done();
	});
});