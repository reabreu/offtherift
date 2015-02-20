'use strict';

(function() {
	// Patches Controller Spec
	describe('Patches Controller Tests', function() {
		// Initialize global variables
		var PatchesController,
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

			// Initialize the Patches controller.
			PatchesController = $controller('PatchesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Patch object fetched from XHR', inject(function(Patches) {
			// Create sample Patch using the Patches service
			var samplePatch = new Patches({
				name: 'New Patch'
			});

			// Create a sample Patches array that includes the new Patch
			var samplePatches = [samplePatch];

			// Set GET response
			$httpBackend.expectGET('patches').respond(samplePatches);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.patches).toEqualData(samplePatches);
		}));

		it('$scope.findOne() should create an array with one Patch object fetched from XHR using a patchId URL parameter', inject(function(Patches) {
			// Define a sample Patch object
			var samplePatch = new Patches({
				name: 'New Patch'
			});

			// Set the URL parameter
			$stateParams.patchId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/patches\/([0-9a-fA-F]{24})$/).respond(samplePatch);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.patch).toEqualData(samplePatch);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Patches) {
			// Create a sample Patch object
			var samplePatchPostData = new Patches({
				name: 'New Patch'
			});

			// Create a sample Patch response
			var samplePatchResponse = new Patches({
				_id: '525cf20451979dea2c000001',
				name: 'New Patch'
			});

			// Fixture mock form input values
			scope.name = 'New Patch';

			// Set POST response
			$httpBackend.expectPOST('patches', samplePatchPostData).respond(samplePatchResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Patch was created
			expect($location.path()).toBe('/patches/' + samplePatchResponse._id);
		}));

		it('$scope.update() should update a valid Patch', inject(function(Patches) {
			// Define a sample Patch put data
			var samplePatchPutData = new Patches({
				_id: '525cf20451979dea2c000001',
				name: 'New Patch'
			});

			// Mock Patch in scope
			scope.patch = samplePatchPutData;

			// Set PUT response
			$httpBackend.expectPUT(/patches\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/patches/' + samplePatchPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid patchId and remove the Patch from the scope', inject(function(Patches) {
			// Create new Patch object
			var samplePatch = new Patches({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Patches array and include the Patch
			scope.patches = [samplePatch];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/patches\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePatch);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.patches.length).toBe(0);
		}));
	});
}());