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
					return Urlprotection.checkSendToHome($q, Authentication, $state, $timeout);
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