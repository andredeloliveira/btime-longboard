'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Marca = mongoose.model('Marca'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, marca;

/**
 * Marca routes tests
 */
describe('Marca CRUD tests', function() {
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

		// Save a user to the test db and create new Marca
		user.save(function() {
			marca = {
				name: 'Marca Name'
			};

			done();
		});
	});

	it('should be able to save Marca instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Marca
				agent.post('/marcas')
					.send(marca)
					.expect(200)
					.end(function(marcaSaveErr, marcaSaveRes) {
						// Handle Marca save error
						if (marcaSaveErr) done(marcaSaveErr);

						// Get a list of Marcas
						agent.get('/marcas')
							.end(function(marcasGetErr, marcasGetRes) {
								// Handle Marca save error
								if (marcasGetErr) done(marcasGetErr);

								// Get Marcas list
								var marcas = marcasGetRes.body;

								// Set assertions
								(marcas[0].user._id).should.equal(userId);
								(marcas[0].name).should.match('Marca Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Marca instance if not logged in', function(done) {
		agent.post('/marcas')
			.send(marca)
			.expect(401)
			.end(function(marcaSaveErr, marcaSaveRes) {
				// Call the assertion callback
				done(marcaSaveErr);
			});
	});

	it('should not be able to save Marca instance if no name is provided', function(done) {
		// Invalidate name field
		marca.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Marca
				agent.post('/marcas')
					.send(marca)
					.expect(400)
					.end(function(marcaSaveErr, marcaSaveRes) {
						// Set message assertion
						(marcaSaveRes.body.message).should.match('Please fill Marca name');
						
						// Handle Marca save error
						done(marcaSaveErr);
					});
			});
	});

	it('should be able to update Marca instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Marca
				agent.post('/marcas')
					.send(marca)
					.expect(200)
					.end(function(marcaSaveErr, marcaSaveRes) {
						// Handle Marca save error
						if (marcaSaveErr) done(marcaSaveErr);

						// Update Marca name
						marca.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Marca
						agent.put('/marcas/' + marcaSaveRes.body._id)
							.send(marca)
							.expect(200)
							.end(function(marcaUpdateErr, marcaUpdateRes) {
								// Handle Marca update error
								if (marcaUpdateErr) done(marcaUpdateErr);

								// Set assertions
								(marcaUpdateRes.body._id).should.equal(marcaSaveRes.body._id);
								(marcaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Marcas if not signed in', function(done) {
		// Create new Marca model instance
		var marcaObj = new Marca(marca);

		// Save the Marca
		marcaObj.save(function() {
			// Request Marcas
			request(app).get('/marcas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Marca if not signed in', function(done) {
		// Create new Marca model instance
		var marcaObj = new Marca(marca);

		// Save the Marca
		marcaObj.save(function() {
			request(app).get('/marcas/' + marcaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', marca.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Marca instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Marca
				agent.post('/marcas')
					.send(marca)
					.expect(200)
					.end(function(marcaSaveErr, marcaSaveRes) {
						// Handle Marca save error
						if (marcaSaveErr) done(marcaSaveErr);

						// Delete existing Marca
						agent.delete('/marcas/' + marcaSaveRes.body._id)
							.send(marca)
							.expect(200)
							.end(function(marcaDeleteErr, marcaDeleteRes) {
								// Handle Marca error error
								if (marcaDeleteErr) done(marcaDeleteErr);

								// Set assertions
								(marcaDeleteRes.body._id).should.equal(marcaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Marca instance if not signed in', function(done) {
		// Set Marca user 
		marca.user = user;

		// Create new Marca model instance
		var marcaObj = new Marca(marca);

		// Save the Marca
		marcaObj.save(function() {
			// Try deleting Marca
			request(app).delete('/marcas/' + marcaObj._id)
			.expect(401)
			.end(function(marcaDeleteErr, marcaDeleteRes) {
				// Set message assertion
				(marcaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Marca error error
				done(marcaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Marca.remove().exec();
		done();
	});
});