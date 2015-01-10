'use strict';

//Setting up route
angular.module('patches').config(['$stateProvider',
	function($stateProvider) {
		// Patches state routing
		$stateProvider.
		state('listPatches', {
			url: '/patches',
			templateUrl: 'modules/patches/views/list-patches.client.view.html'
		}).
		state('createPatch', {
			url: '/patches/create',
			templateUrl: 'modules/patches/views/create-patch.client.view.html'
		}).
		state('viewPatch', {
			url: '/patches/:patchId',
			templateUrl: 'modules/patches/views/view-patch.client.view.html'
		}).
		state('editPatch', {
			url: '/patches/:patchId/edit',
			templateUrl: 'modules/patches/views/edit-patch.client.view.html'
		});
	}
]);