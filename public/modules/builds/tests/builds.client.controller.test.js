'use strict';

(function() {
	// Builds Controller Spec
	describe('Builds Controller Tests', function() {
		// Initialize global variables
		var BuildsController,
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

			// Initialize the Builds controller.
			BuildsController = $controller('BuildsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Build object fetched from XHR', inject(function(Builds) {
			// Create sample Build using the Builds service
			var sampleBuild = new Builds({
				name: 'New Build'
			});

			// Create a sample Builds array that includes the new Build
			var sampleBuilds = [sampleBuild];

			// Set GET response
			$httpBackend.expectGET('builds').respond(sampleBuilds);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.builds).toEqualData(sampleBuilds);
		}));

		it('$scope.findOne() should create an array with one Build object fetched from XHR using a buildId URL parameter', inject(function(Builds) {
			// Define a sample Build object
			var sampleBuild = new Builds({
				name: 'New Build'
			});

			// Set the URL parameter
			$stateParams.buildId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/builds\/([0-9a-fA-F]{24})$/).respond(sampleBuild);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.build).toEqualData(sampleBuild);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Builds) {
			// Create a sample Build object
			var sampleBuildPostData = new Builds({
				name: 'New Build'
			});

			// Create a sample Build response
			var sampleBuildResponse = new Builds({
				_id: '525cf20451979dea2c000001',
				name: 'New Build'
			});

			// Fixture mock form input values
			scope.name = 'New Build';

			// Set POST response
			$httpBackend.expectPOST('builds', sampleBuildPostData).respond(sampleBuildResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Build was created
			expect($location.path()).toBe('/builds/' + sampleBuildResponse._id);
		}));

		it('$scope.update() should update a valid Build', inject(function(Builds) {
			// Define a sample Build put data
			var sampleBuildPutData = new Builds({
				_id: '525cf20451979dea2c000001',
				name: 'New Build'
			});

			// Mock Build in scope
			scope.build = sampleBuildPutData;

			// Set PUT response
			$httpBackend.expectPUT(/builds\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/builds/' + sampleBuildPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid buildId and remove the Build from the scope', inject(function(Builds) {
			// Create new Build object
			var sampleBuild = new Builds({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Builds array and include the Build
			scope.builds = [sampleBuild];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/builds\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleBuild);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.builds.length).toBe(0);
		}));
	});
}());