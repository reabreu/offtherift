'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('dashboard', {
			url: '/dashboard',
			templateUrl: 'modules/users/views/profile.client.view.html',
			resolve: {
				load: ['$q', 'Authentication', '$state','$timeout','Urlprotection', function($q, Authentication, $state, $timeout, Urlprotection ) {
					if (angular.isDefined(Authentication) && Authentication.user) {
						// Resolve the promise successfully
						return $q.when();
					} else {

						// The next bit of code is asynchronously tricky.
						$timeout(function() {
							// This code runs after the authentication promise has been rejected.
							// Go to the log-in page
							$state.go('teaser');
						})

						// Reject the authentication promise to prevent the state from loading
						return $q.reject();
					}
				}]
			}
		}).
		state('login', {
			url: '/login',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('loginHash', {
			url: '/login/:hash',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		})
	}
]);