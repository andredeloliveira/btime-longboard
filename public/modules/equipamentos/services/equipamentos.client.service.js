'use strict';

//Equipamentos service used to communicate Equipamentos REST endpoints
angular.module('equipamentos').factory('Equipamentos', ['$resource',
	function($resource) {
		return $resource('equipamentos/:equipamentoId', { equipamentoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);