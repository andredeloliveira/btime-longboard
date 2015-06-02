'use strict';

//Setting up route
angular.module('etapas').config(['$stateProvider',
	function($stateProvider) {
		// Etapas state routing
		$stateProvider.
		state('listEtapas', {
			url: '/etapas',
			templateUrl: 'modules/etapas/views/list-etapas.client.view.html'
		}).
		state('createEtapa', {
			url: '/etapas/create',
			templateUrl: 'modules/etapas/views/create-etapa.client.view.html'
		}).
		state('viewEtapa', {
			url: '/etapas/:etapaId',
			templateUrl: 'modules/etapas/views/view-etapa.client.view.html'
		}).
		state('editEtapa', {
			url: '/etapas/:etapaId/edit',
			templateUrl: 'modules/etapas/views/edit-etapa.client.view.html'
		});
	}
]);