'use strict';

(function() {
	// Etapas Controller Spec
	describe('Etapas Controller Tests', function() {
		// Initialize global variables
		var EtapasController,
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

			// Initialize the Etapas controller.
			EtapasController = $controller('EtapasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Etapa object fetched from XHR', inject(function(Etapas) {
			// Create sample Etapa using the Etapas service
			var sampleEtapa = new Etapas({
				name: 'New Etapa'
			});

			// Create a sample Etapas array that includes the new Etapa
			var sampleEtapas = [sampleEtapa];

			// Set GET response
			$httpBackend.expectGET('etapas').respond(sampleEtapas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.etapas).toEqualData(sampleEtapas);
		}));

		it('$scope.findOne() should create an array with one Etapa object fetched from XHR using a etapaId URL parameter', inject(function(Etapas) {
			// Define a sample Etapa object
			var sampleEtapa = new Etapas({
				name: 'New Etapa'
			});

			// Set the URL parameter
			$stateParams.etapaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/etapas\/([0-9a-fA-F]{24})$/).respond(sampleEtapa);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.etapa).toEqualData(sampleEtapa);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Etapas) {
			// Create a sample Etapa object
			var sampleEtapaPostData = new Etapas({
				name: 'New Etapa'
			});

			// Create a sample Etapa response
			var sampleEtapaResponse = new Etapas({
				_id: '525cf20451979dea2c000001',
				name: 'New Etapa'
			});

			// Fixture mock form input values
			scope.name = 'New Etapa';

			// Set POST response
			$httpBackend.expectPOST('etapas', sampleEtapaPostData).respond(sampleEtapaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Etapa was created
			expect($location.path()).toBe('/etapas/' + sampleEtapaResponse._id);
		}));

		it('$scope.update() should update a valid Etapa', inject(function(Etapas) {
			// Define a sample Etapa put data
			var sampleEtapaPutData = new Etapas({
				_id: '525cf20451979dea2c000001',
				name: 'New Etapa'
			});

			// Mock Etapa in scope
			scope.etapa = sampleEtapaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/etapas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/etapas/' + sampleEtapaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid etapaId and remove the Etapa from the scope', inject(function(Etapas) {
			// Create new Etapa object
			var sampleEtapa = new Etapas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Etapas array and include the Etapa
			scope.etapas = [sampleEtapa];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/etapas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEtapa);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.etapas.length).toBe(0);
		}));
	});
}());