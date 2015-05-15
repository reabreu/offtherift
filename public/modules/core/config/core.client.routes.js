'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/dashboard');

		// Home state routing
		$stateProvider.
		/*state('home', {
			url: '/',
			templateUrl: 'modules/core/views/pages/home.client.view.html',
			resolve: {
				load: ['$q', 'Authentication', '$location', function($q, Authentication, $location) {
					var deferred = $q.defer();

					if (angular.isDefined(Authentication) && Authentication.user) {
						deferred.resolve();
						return deferred.promise;
					}

					$location.path('/teaser');
				}]
			}
		}).*/
		state('teaser', {
			url: '/teaser',
			templateUrl: 'modules/core/views/pages/teaser.client.view.html'
		}).
		state('aboutus', {
			url: '/about-us',
			templateUrl: 'modules/core/views/pages/about-us.client.view.html'
		}).
		state('contactus', {
			url: '/contact-us',
			templateUrl: 'modules/core/views/pages/contact-us.client.view.html'
		}).
		state('activation', {
			url: '/account/activation/:hash',
			templateUrl: 'modules/core/views/pages/user-activation.client.view.html'
		});

	}
]);