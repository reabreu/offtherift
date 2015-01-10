'use strict';

//Setting up route
angular.module('patch').config(['$stateProvider',
	function($stateProvider) {
		// Patch state routing
		$stateProvider.
		state('patch', {
			url: '/patch',
			templateUrl: 'modules/patch/views/indexpatch.client.view.html'
		});
	}
]);