'use strict';

// Etapas controller
angular.module('etapas').controller('EtapasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Etapas',
	function($scope, $stateParams, $location, Authentication, Etapas) {
		$scope.authentication = Authentication;

		// Create new Etapa
		$scope.create = function() {
			// Create new Etapa object
			var etapa = new Etapas ({
				name: this.name
			});

			// Redirect after save
			etapa.$save(function(response) {
				$location.path('etapas/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Etapa
		$scope.remove = function(etapa) {
			if ( etapa ) { 
				etapa.$remove();

				for (var i in $scope.etapas) {
					if ($scope.etapas [i] === etapa) {
						$scope.etapas.splice(i, 1);
					}
				}
			} else {
				$scope.etapa.$remove(function() {
					$location.path('etapas');
				});
			}
		};

		// Update existing Etapa
		$scope.update = function() {
			var etapa = $scope.etapa;

			etapa.$update(function() {
				$location.path('etapas/' + etapa._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Etapas
		$scope.find = function() {
			$scope.etapas = Etapas.query();
		};

		// Find existing Etapa
		$scope.findOne = function() {
			$scope.etapa = Etapas.get({ 
				etapaId: $stateParams.etapaId
			});
		};
	}
]);