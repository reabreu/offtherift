'use strict';

(function() {
	// Masteries Controller Spec
	describe('Masteries Controller Tests', function() {
		// Initialize global variables
		var MasteriesController,
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

			// Initialize the Masteries controller.
			MasteriesController = $controller('MasteriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Masterie object fetched from XHR', inject(function(Masteries) {
			// Create sample Masterie using the Masteries service
			var sampleMasterie = new Masteries({
				name: 'New Masterie'
			});

			// Create a sample Masteries array that includes the new Masterie
			var sampleMasteries = [sampleMasterie];

			// Set GET response
			$httpBackend.expectGET('masteries').respond(sampleMasteries);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.masteries).toEqualData(sampleMasteries);
		}));

		it('$scope.findOne() should create an array with one Masterie object fetched from XHR using a masterieId URL parameter', inject(function(Masteries) {
			// Define a sample Masterie object
			var sampleMasterie = new Masteries({
				name: 'New Masterie'
			});

			// Set the URL parameter
			$stateParams.masterieId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/masteries\/([0-9a-fA-F]{24})$/).respond(sampleMasterie);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.masterie).toEqualData(sampleMasterie);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Masteries) {
			// Create a sample Masterie object
			var sampleMasteriePostData = new Masteries({
				name: 'New Masterie'
			});

			// Create a sample Masterie response
			var sampleMasterieResponse = new Masteries({
				_id: '525cf20451979dea2c000001',
				name: 'New Masterie'
			});

			// Fixture mock form input values
			scope.name = 'New Masterie';

			// Set POST response
			$httpBackend.expectPOST('masteries', sampleMasteriePostData).respond(sampleMasterieResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Masterie was created
			expect($location.path()).toBe('/masteries/' + sampleMasterieResponse._id);
		}));

		it('$scope.update() should update a valid Masterie', inject(function(Masteries) {
			// Define a sample Masterie put data
			var sampleMasteriePutData = new Masteries({
				_id: '525cf20451979dea2c000001',
				name: 'New Masterie'
			});

			// Mock Masterie in scope
			scope.masterie = sampleMasteriePutData;

			// Set PUT response
			$httpBackend.expectPUT(/masteries\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/masteries/' + sampleMasteriePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid masterieId and remove the Masterie from the scope', inject(function(Masteries) {
			// Create new Masterie object
			var sampleMasterie = new Masteries({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Masteries array and include the Masterie
			scope.masteries = [sampleMasterie];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/masteries\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMasterie);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.masteries.length).toBe(0);
		}));
	});
}());