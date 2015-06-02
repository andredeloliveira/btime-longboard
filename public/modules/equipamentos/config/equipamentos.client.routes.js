'use strict';

//Setting up route
angular.module('equipamentos').config(['$stateProvider',
	function($stateProvider) {
		// Equipamentos state routing
		$stateProvider.
		state('listEquipamentos', {
			url: '/equipamentos',
			templateUrl: 'modules/equipamentos/views/list-equipamentos.client.view.html'
		}).
		state('createEquipamento', {
			url: '/equipamentos/create',
			templateUrl: 'modules/equipamentos/views/create-equipamento.client.view.html'
		}).
		state('viewEquipamento', {
			url: '/equipamentos/:equipamentoId',
			templateUrl: 'modules/equipamentos/views/view-equipamento.client.view.html'
		}).
		state('editEquipamento', {
			url: '/equipamentos/:equipamentoId/edit',
			templateUrl: 'modules/equipamentos/views/edit-equipamento.client.view.html'
		});
	}
]);