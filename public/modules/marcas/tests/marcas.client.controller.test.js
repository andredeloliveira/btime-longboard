'use strict';

(function() {
	// Marcas Controller Spec
	describe('Marcas Controller Tests', function() {
		// Initialize global variables
		var MarcasController,
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

			// Initialize the Marcas controller.
			MarcasController = $controller('MarcasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Marca object fetched from XHR', inject(function(Marcas) {
			// Create sample Marca using the Marcas service
			var sampleMarca = new Marcas({
				name: 'New Marca'
			});

			// Create a sample Marcas array that includes the new Marca
			var sampleMarcas = [sampleMarca];

			// Set GET response
			$httpBackend.expectGET('marcas').respond(sampleMarcas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.marcas).toEqualData(sampleMarcas);
		}));

		it('$scope.findOne() should create an array with one Marca object fetched from XHR using a marcaId URL parameter', inject(function(Marcas) {
			// Define a sample Marca object
			var sampleMarca = new Marcas({
				name: 'New Marca'
			});

			// Set the URL parameter
			$stateParams.marcaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/marcas\/([0-9a-fA-F]{24})$/).respond(sampleMarca);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.marca).toEqualData(sampleMarca);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Marcas) {
			// Create a sample Marca object
			var sampleMarcaPostData = new Marcas({
				name: 'New Marca'
			});

			// Create a sample Marca response
			var sampleMarcaResponse = new Marcas({
				_id: '525cf20451979dea2c000001',
				name: 'New Marca'
			});

			// Fixture mock form input values
			scope.name = 'New Marca';

			// Set POST response
			$httpBackend.expectPOST('marcas', sampleMarcaPostData).respond(sampleMarcaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Marca was created
			expect($location.path()).toBe('/marcas/' + sampleMarcaResponse._id);
		}));

		it('$scope.update() should update a valid Marca', inject(function(Marcas) {
			// Define a sample Marca put data
			var sampleMarcaPutData = new Marcas({
				_id: '525cf20451979dea2c000001',
				name: 'New Marca'
			});

			// Mock Marca in scope
			scope.marca = sampleMarcaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/marcas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/marcas/' + sampleMarcaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid marcaId and remove the Marca from the scope', inject(function(Marcas) {
			// Create new Marca object
			var sampleMarca = new Marcas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Marcas array and include the Marca
			scope.marcas = [sampleMarca];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/marcas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMarca);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.marcas.length).toBe(0);
		}));
	});
}());