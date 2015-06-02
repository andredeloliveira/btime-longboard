'use strict';

//Etapas service used to communicate Etapas REST endpoints
angular.module('etapas').factory('Etapas', ['$resource',
	function($resource) {
		return $resource('etapas/:etapaId', { etapaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);