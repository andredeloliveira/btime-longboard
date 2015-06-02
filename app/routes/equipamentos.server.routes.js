'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var equipamentos = require('../../app/controllers/equipamentos.server.controller');

	// Equipamentos Routes
	app.route('/equipamentos')
		.get(equipamentos.list)
		.post(users.requiresLogin, equipamentos.create);

	app.route('/equipamentos/:equipamentoId')
		.get(equipamentos.read)
		.put(users.requiresLogin, equipamentos.hasAuthorization, equipamentos.update)
		.delete(users.requiresLogin, equipamentos.hasAuthorization, equipamentos.delete);

	// Finish by binding the Equipamento middleware
	app.param('equipamentoId', equipamentos.equipamentoByID);
};
