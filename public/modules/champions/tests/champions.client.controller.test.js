'use strict';

(function() {
	// Champions Controller Spec
	describe('Champions Controller Tests', function() {
		// Initialize global variables
		var ChampionsController,
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

			// Initialize the Champions controller.
			ChampionsController = $controller('ChampionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Champion object fetched from XHR', inject(function(Champions) {
			// Create sample Champion using the Champions service
			var sampleChampion = new Champions({
				name: 'New Champion'
			});

			// Create a sample Champions array that includes the new Champion
			var sampleChampions = [sampleChampion];

			// Set GET response
			$httpBackend.expectGET('champions').respond(sampleChampions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.champions).toEqualData(sampleChampions);
		}));

		it('$scope.findOne() should create an array with one Champion object fetched from XHR using a championId URL parameter', inject(function(Champions) {
			// Define a sample Champion object
			var sampleChampion = new Champions({
				name: 'New Champion'
			});

			// Set the URL parameter
			$stateParams.championId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/champions\/([0-9a-fA-F]{24})$/).respond(sampleChampion);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.champion).toEqualData(sampleChampion);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Champions) {
			// Create a sample Champion object
			var sampleChampionPostData = new Champions({
				name: 'New Champion'
			});

			// Create a sample Champion response
			var sampleChampionResponse = new Champions({
				_id: '525cf20451979dea2c000001',
				name: 'New Champion'
			});

			// Fixture mock form input values
			scope.name = 'New Champion';

			// Set POST response
			$httpBackend.expectPOST('champions', sampleChampionPostData).respond(sampleChampionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Champion was created
			expect($location.path()).toBe('/champions/' + sampleChampionResponse._id);
		}));

		it('$scope.update() should update a valid Champion', inject(function(Champions) {
			// Define a sample Champion put data
			var sampleChampionPutData = new Champions({
				_id: '525cf20451979dea2c000001',
				name: 'New Champion'
			});

			// Mock Champion in scope
			scope.champion = sampleChampionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/champions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/champions/' + sampleChampionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid championId and remove the Champion from the scope', inject(function(Champions) {
			// Create new Champion object
			var sampleChampion = new Champions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Champions array and include the Champion
			scope.champions = [sampleChampion];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/champions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleChampion);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.champions.length).toBe(0);
		}));
	});
}());