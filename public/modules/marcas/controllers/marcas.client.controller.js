'use strict';

// Marcas controller
angular.module('marcas').controller('MarcasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Marcas',
	function($scope, $stateParams, $location, Authentication, Marcas) {
		$scope.authentication = Authentication;

		// Create new Marca
		$scope.create = function() {
			// Create new Marca object
			var marca = new Marcas ({
				name: this.name
			});

			// Redirect after save
			marca.$save(function(response) {
				$location.path('marcas/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Marca
		$scope.remove = function(marca) {
			if ( marca ) { 
				marca.$remove();

				for (var i in $scope.marcas) {
					if ($scope.marcas [i] === marca) {
						$scope.marcas.splice(i, 1);
					}
				}
			} else {
				$scope.marca.$remove(function() {
					$location.path('marcas');
				});
			}
		};

		// Update existing Marca
		$scope.update = function() {
			var marca = $scope.marca;

			marca.$update(function() {
				$location.path('marcas/' + marca._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Marcas
		$scope.find = function() {
			$scope.marcas = Marcas.query();
		};

		// Find existing Marca
		$scope.findOne = function() {
			$scope.marca = Marcas.get({ 
				marcaId: $stateParams.marcaId
			});
		};
	}
]);