'use strict';

//Marcas service used to communicate Marcas REST endpoints
angular.module('marcas').factory('Marcas', ['$resource',
	function($resource) {
		return $resource('marcas/:marcaId', { marcaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);