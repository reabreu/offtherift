'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/dashboard');

		// Home state routing
		$stateProvider.
		state('teaser', {
			url: '/teaser',
			templateUrl: 'modules/core/views/pages/teaser.client.view.html'
		}).
		state('aboutus', {
			url: '/about-us',
			templateUrl: 'modules/core/views/pages/about-us.client.view.html'
		}).
		state('activation', {
			url: '/account/activation/:hash',
			templateUrl: 'modules/core/views/pages/user-activation.client.view.html'
		}).
		state('evaluate', {
			url: '/account/evaluate/:state',
			templateUrl: 'modules/core/views/pages/user-evaluate.client.view.html'
		});

	}
]);