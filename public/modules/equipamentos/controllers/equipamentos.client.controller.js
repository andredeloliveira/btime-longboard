'use strict';

// Equipamentos controller
angular.module('equipamentos').controller('EquipamentosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Equipamentos',
	function($scope, $stateParams, $location, Authentication, Equipamentos) {
		$scope.authentication = Authentication;

		// Create new Equipamento
		$scope.create = function() {
			// Create new Equipamento object
			var equipamento = new Equipamentos ({
				name: this.name
			});

			// Redirect after save
			equipamento.$save(function(response) {
				$location.path('equipamentos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Equipamento
		$scope.remove = function(equipamento) {
			if ( equipamento ) { 
				equipamento.$remove();

				for (var i in $scope.equipamentos) {
					if ($scope.equipamentos [i] === equipamento) {
						$scope.equipamentos.splice(i, 1);
					}
				}
			} else {
				$scope.equipamento.$remove(function() {
					$location.path('equipamentos');
				});
			}
		};

		// Update existing Equipamento
		$scope.update = function() {
			var equipamento = $scope.equipamento;

			equipamento.$update(function() {
				$location.path('equipamentos/' + equipamento._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Equipamentos
		$scope.find = function() {
			$scope.equipamentos = Equipamentos.query();
		};

		// Find existing Equipamento
		$scope.findOne = function() {
			$scope.equipamento = Equipamentos.get({ 
				equipamentoId: $stateParams.equipamentoId
			});
		};
	}
]);