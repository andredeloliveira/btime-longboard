'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Equipamento = mongoose.model('Equipamento'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, equipamento;

/**
 * Equipamento routes tests
 */
describe('Equipamento CRUD tests', function() {
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

		// Save a user to the test db and create new Equipamento
		user.save(function() {
			equipamento = {
				name: 'Equipamento Name'
			};

			done();
		});
	});

	it('should be able to save Equipamento instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Equipamento
				agent.post('/equipamentos')
					.send(equipamento)
					.expect(200)
					.end(function(equipamentoSaveErr, equipamentoSaveRes) {
						// Handle Equipamento save error
						if (equipamentoSaveErr) done(equipamentoSaveErr);

						// Get a list of Equipamentos
						agent.get('/equipamentos')
							.end(function(equipamentosGetErr, equipamentosGetRes) {
								// Handle Equipamento save error
								if (equipamentosGetErr) done(equipamentosGetErr);

								// Get Equipamentos list
								var equipamentos = equipamentosGetRes.body;

								// Set assertions
								(equipamentos[0].user._id).should.equal(userId);
								(equipamentos[0].name).should.match('Equipamento Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Equipamento instance if not logged in', function(done) {
		agent.post('/equipamentos')
			.send(equipamento)
			.expect(401)
			.end(function(equipamentoSaveErr, equipamentoSaveRes) {
				// Call the assertion callback
				done(equipamentoSaveErr);
			});
	});

	it('should not be able to save Equipamento instance if no name is provided', function(done) {
		// Invalidate name field
		equipamento.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Equipamento
				agent.post('/equipamentos')
					.send(equipamento)
					.expect(400)
					.end(function(equipamentoSaveErr, equipamentoSaveRes) {
						// Set message assertion
						(equipamentoSaveRes.body.message).should.match('Please fill Equipamento name');
						
						// Handle Equipamento save error
						done(equipamentoSaveErr);
					});
			});
	});

	it('should be able to update Equipamento instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Equipamento
				agent.post('/equipamentos')
					.send(equipamento)
					.expect(200)
					.end(function(equipamentoSaveErr, equipamentoSaveRes) {
						// Handle Equipamento save error
						if (equipamentoSaveErr) done(equipamentoSaveErr);

						// Update Equipamento name
						equipamento.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Equipamento
						agent.put('/equipamentos/' + equipamentoSaveRes.body._id)
							.send(equipamento)
							.expect(200)
							.end(function(equipamentoUpdateErr, equipamentoUpdateRes) {
								// Handle Equipamento update error
								if (equipamentoUpdateErr) done(equipamentoUpdateErr);

								// Set assertions
								(equipamentoUpdateRes.body._id).should.equal(equipamentoSaveRes.body._id);
								(equipamentoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Equipamentos if not signed in', function(done) {
		// Create new Equipamento model instance
		var equipamentoObj = new Equipamento(equipamento);

		// Save the Equipamento
		equipamentoObj.save(function() {
			// Request Equipamentos
			request(app).get('/equipamentos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Equipamento if not signed in', function(done) {
		// Create new Equipamento model instance
		var equipamentoObj = new Equipamento(equipamento);

		// Save the Equipamento
		equipamentoObj.save(function() {
			request(app).get('/equipamentos/' + equipamentoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', equipamento.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Equipamento instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Equipamento
				agent.post('/equipamentos')
					.send(equipamento)
					.expect(200)
					.end(function(equipamentoSaveErr, equipamentoSaveRes) {
						// Handle Equipamento save error
						if (equipamentoSaveErr) done(equipamentoSaveErr);

						// Delete existing Equipamento
						agent.delete('/equipamentos/' + equipamentoSaveRes.body._id)
							.send(equipamento)
							.expect(200)
							.end(function(equipamentoDeleteErr, equipamentoDeleteRes) {
								// Handle Equipamento error error
								if (equipamentoDeleteErr) done(equipamentoDeleteErr);

								// Set assertions
								(equipamentoDeleteRes.body._id).should.equal(equipamentoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Equipamento instance if not signed in', function(done) {
		// Set Equipamento user 
		equipamento.user = user;

		// Create new Equipamento model instance
		var equipamentoObj = new Equipamento(equipamento);

		// Save the Equipamento
		equipamentoObj.save(function() {
			// Try deleting Equipamento
			request(app).delete('/equipamentos/' + equipamentoObj._id)
			.expect(401)
			.end(function(equipamentoDeleteErr, equipamentoDeleteRes) {
				// Set message assertion
				(equipamentoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Equipamento error error
				done(equipamentoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Equipamento.remove().exec();
		done();
	});
});