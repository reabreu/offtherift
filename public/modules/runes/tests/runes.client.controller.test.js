'use strict';

(function() {
	// Runes Controller Spec
	describe('Runes Controller Tests', function() {
		// Initialize global variables
		var RunesController,
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

			// Initialize the Runes controller.
			RunesController = $controller('RunesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Rune object fetched from XHR', inject(function(Runes) {
			// Create sample Rune using the Runes service
			var sampleRune = new Runes({
				name: 'New Rune'
			});

			// Create a sample Runes array that includes the new Rune
			var sampleRunes = [sampleRune];

			// Set GET response
			$httpBackend.expectGET('runes').respond(sampleRunes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.runes).toEqualData(sampleRunes);
		}));

		it('$scope.findOne() should create an array with one Rune object fetched from XHR using a runeId URL parameter', inject(function(Runes) {
			// Define a sample Rune object
			var sampleRune = new Runes({
				name: 'New Rune'
			});

			// Set the URL parameter
			$stateParams.runeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/runes\/([0-9a-fA-F]{24})$/).respond(sampleRune);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rune).toEqualData(sampleRune);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Runes) {
			// Create a sample Rune object
			var sampleRunePostData = new Runes({
				name: 'New Rune'
			});

			// Create a sample Rune response
			var sampleRuneResponse = new Runes({
				_id: '525cf20451979dea2c000001',
				name: 'New Rune'
			});

			// Fixture mock form input values
			scope.name = 'New Rune';

			// Set POST response
			$httpBackend.expectPOST('runes', sampleRunePostData).respond(sampleRuneResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Rune was created
			expect($location.path()).toBe('/runes/' + sampleRuneResponse._id);
		}));

		it('$scope.update() should update a valid Rune', inject(function(Runes) {
			// Define a sample Rune put data
			var sampleRunePutData = new Runes({
				_id: '525cf20451979dea2c000001',
				name: 'New Rune'
			});

			// Mock Rune in scope
			scope.rune = sampleRunePutData;

			// Set PUT response
			$httpBackend.expectPUT(/runes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/runes/' + sampleRunePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid runeId and remove the Rune from the scope', inject(function(Runes) {
			// Create new Rune object
			var sampleRune = new Runes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Runes array and include the Rune
			scope.runes = [sampleRune];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/runes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRune);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.runes.length).toBe(0);
		}));
	});
}());