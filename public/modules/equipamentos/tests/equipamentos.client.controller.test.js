'use strict';

(function() {
	// Equipamentos Controller Spec
	describe('Equipamentos Controller Tests', function() {
		// Initialize global variables
		var EquipamentosController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Equipamentos controller.
			EquipamentosController = $controller('EquipamentosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Equipamento object fetched from XHR', inject(function(Equipamentos) {
			// Create sample Equipamento using the Equipamentos service
			var sampleEquipamento = new Equipamentos({
				name: 'New Equipamento'
			});

			// Create a sample Equipamentos array that includes the new Equipamento
			var sampleEquipamentos = [sampleEquipamento];

			// Set GET response
			$httpBackend.expectGET('equipamentos').respond(sampleEquipamentos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.equipamentos).toEqualData(sampleEquipamentos);
		}));

		it('$scope.findOne() should create an array with one Equipamento object fetched from XHR using a equipamentoId URL parameter', inject(function(Equipamentos) {
			// Define a sample Equipamento object
			var sampleEquipamento = new Equipamentos({
				name: 'New Equipamento'
			});

			// Set the URL parameter
			$stateParams.equipamentoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/equipamentos\/([0-9a-fA-F]{24})$/).respond(sampleEquipamento);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.equipamento).toEqualData(sampleEquipamento);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Equipamentos) {
			// Create a sample Equipamento object
			var sampleEquipamentoPostData = new Equipamentos({
				name: 'New Equipamento'
			});

			// Create a sample Equipamento response
			var sampleEquipamentoResponse = new Equipamentos({
				_id: '525cf20451979dea2c000001',
				name: 'New Equipamento'
			});

			// Fixture mock form input values
			scope.name = 'New Equipamento';

			// Set POST response
			$httpBackend.expectPOST('equipamentos', sampleEquipamentoPostData).respond(sampleEquipamentoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Equipamento was created
			expect($location.path()).toBe('/equipamentos/' + sampleEquipamentoResponse._id);
		}));

		it('$scope.update() should update a valid Equipamento', inject(function(Equipamentos) {
			// Define a sample Equipamento put data
			var sampleEquipamentoPutData = new Equipamentos({
				_id: '525cf20451979dea2c000001',
				name: 'New Equipamento'
			});

			// Mock Equipamento in scope
			scope.equipamento = sampleEquipamentoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/equipamentos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/equipamentos/' + sampleEquipamentoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid equipamentoId and remove the Equipamento from the scope', inject(function(Equipamentos) {
			// Create new Equipamento object
			var sampleEquipamento = new Equipamentos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Equipamentos array and include the Equipamento
			scope.equipamentos = [sampleEquipamento];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/equipamentos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEquipamento);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.equipamentos.length).toBe(0);
		}));
	});
}());