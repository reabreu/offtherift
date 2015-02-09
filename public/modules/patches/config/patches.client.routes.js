'use strict';

//Setting up route
angular.module('patches').config(['$stateProvider',
	function($stateProvider) {
		// Patches state routing
		$stateProvider.
		state('listPatches', {
			url: '/listPatches',
			templateUrl: 'modules/patches/views/list-patches.client.view.html'
		});
	}
]);