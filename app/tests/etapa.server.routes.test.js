'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Etapa = mongoose.model('Etapa'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, etapa;

/**
 * Etapa routes tests
 */
describe('Etapa CRUD tests', function() {
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

		// Save a user to the test db and create new Etapa
		user.save(function() {
			etapa = {
				name: 'Etapa Name'
			};

			done();
		});
	});

	it('should be able to save Etapa instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Etapa
				agent.post('/etapas')
					.send(etapa)
					.expect(200)
					.end(function(etapaSaveErr, etapaSaveRes) {
						// Handle Etapa save error
						if (etapaSaveErr) done(etapaSaveErr);

						// Get a list of Etapas
						agent.get('/etapas')
							.end(function(etapasGetErr, etapasGetRes) {
								// Handle Etapa save error
								if (etapasGetErr) done(etapasGetErr);

								// Get Etapas list
								var etapas = etapasGetRes.body;

								// Set assertions
								(etapas[0].user._id).should.equal(userId);
								(etapas[0].name).should.match('Etapa Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Etapa instance if not logged in', function(done) {
		agent.post('/etapas')
			.send(etapa)
			.expect(401)
			.end(function(etapaSaveErr, etapaSaveRes) {
				// Call the assertion callback
				done(etapaSaveErr);
			});
	});

	it('should not be able to save Etapa instance if no name is provided', function(done) {
		// Invalidate name field
		etapa.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Etapa
				agent.post('/etapas')
					.send(etapa)
					.expect(400)
					.end(function(etapaSaveErr, etapaSaveRes) {
						// Set message assertion
						(etapaSaveRes.body.message).should.match('Please fill Etapa name');
						
						// Handle Etapa save error
						done(etapaSaveErr);
					});
			});
	});

	it('should be able to update Etapa instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Etapa
				agent.post('/etapas')
					.send(etapa)
					.expect(200)
					.end(function(etapaSaveErr, etapaSaveRes) {
						// Handle Etapa save error
						if (etapaSaveErr) done(etapaSaveErr);

						// Update Etapa name
						etapa.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Etapa
						agent.put('/etapas/' + etapaSaveRes.body._id)
							.send(etapa)
							.expect(200)
							.end(function(etapaUpdateErr, etapaUpdateRes) {
								// Handle Etapa update error
								if (etapaUpdateErr) done(etapaUpdateErr);

								// Set assertions
								(etapaUpdateRes.body._id).should.equal(etapaSaveRes.body._id);
								(etapaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Etapas if not signed in', function(done) {
		// Create new Etapa model instance
		var etapaObj = new Etapa(etapa);

		// Save the Etapa
		etapaObj.save(function() {
			// Request Etapas
			request(app).get('/etapas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Etapa if not signed in', function(done) {
		// Create new Etapa model instance
		var etapaObj = new Etapa(etapa);

		// Save the Etapa
		etapaObj.save(function() {
			request(app).get('/etapas/' + etapaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', etapa.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Etapa instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Etapa
				agent.post('/etapas')
					.send(etapa)
					.expect(200)
					.end(function(etapaSaveErr, etapaSaveRes) {
						// Handle Etapa save error
						if (etapaSaveErr) done(etapaSaveErr);

						// Delete existing Etapa
						agent.delete('/etapas/' + etapaSaveRes.body._id)
							.send(etapa)
							.expect(200)
							.end(function(etapaDeleteErr, etapaDeleteRes) {
								// Handle Etapa error error
								if (etapaDeleteErr) done(etapaDeleteErr);

								// Set assertions
								(etapaDeleteRes.body._id).should.equal(etapaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Etapa instance if not signed in', function(done) {
		// Set Etapa user 
		etapa.user = user;

		// Create new Etapa model instance
		var etapaObj = new Etapa(etapa);

		// Save the Etapa
		etapaObj.save(function() {
			// Try deleting Etapa
			request(app).delete('/etapas/' + etapaObj._id)
			.expect(401)
			.end(function(etapaDeleteErr, etapaDeleteRes) {
				// Set message assertion
				(etapaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Etapa error error
				done(etapaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Etapa.remove().exec();
		done();
	});
});