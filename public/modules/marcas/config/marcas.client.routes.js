'use strict';

//Setting up route
angular.module('marcas').config(['$stateProvider',
	function($stateProvider) {
		// Marcas state routing
		$stateProvider.
		state('listMarcas', {
			url: '/marcas',
			templateUrl: 'modules/marcas/views/list-marcas.client.view.html'
		}).
		state('createMarca', {
			url: '/marcas/create',
			templateUrl: 'modules/marcas/views/create-marca.client.view.html'
		}).
		state('viewMarca', {
			url: '/marcas/:marcaId',
			templateUrl: 'modules/marcas/views/view-marca.client.view.html'
		}).
		state('editMarca', {
			url: '/marcas/:marcaId/edit',
			templateUrl: 'modules/marcas/views/edit-marca.client.view.html'
		});
	}
]);