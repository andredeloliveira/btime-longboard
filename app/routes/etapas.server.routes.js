'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var etapas = require('../../app/controllers/etapas.server.controller');

	// Etapas Routes
	app.route('/etapas')
		.get(etapas.list)
		.post(users.requiresLogin, etapas.create);

	app.route('/etapas/:etapaId')
		.get(etapas.read)
		.put(users.requiresLogin, etapas.hasAuthorization, etapas.update)
		.delete(users.requiresLogin, etapas.hasAuthorization, etapas.delete);

	// Finish by binding the Etapa middleware
	app.param('etapaId', etapas.etapaByID);
};
