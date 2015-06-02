'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var marcas = require('../../app/controllers/marcas.server.controller');

	// Marcas Routes
	app.route('/marcas')
		.get(marcas.list)
		.post(users.requiresLogin, marcas.create);

	app.route('/marcas/:marcaId')
		.get(marcas.read)
		.put(users.requiresLogin, marcas.hasAuthorization, marcas.update)
		.delete(users.requiresLogin, marcas.hasAuthorization, marcas.delete);

	// Finish by binding the Marca middleware
	app.param('marcaId', marcas.marcaByID);
};
