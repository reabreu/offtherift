'use strict';

//Setting up route
angular.module('builds').config(['$stateProvider',
	function($stateProvider) {
		// Builds state routing
		$stateProvider.
		state('listBuilds', {
			url: '/browse',
			templateUrl: 'modules/builds/views/list-builds.client.view.html'
		}).
		state('listBuildsByVersion', {
			url: '/browse/:version',
			templateUrl: 'modules/builds/views/list-builds.client.view.html'
		}).
		state('listBuildsByVersionByChampion', {
			url: '/browse/:version/:champion',
			templateUrl: 'modules/builds/views/list-builds.client.view.html'
		}).
		state('createBuild', {
			url: '/builds/create',
			templateUrl: 'modules/builds/views/create-build.client.view.html'
		}).
		state('viewBuild', {
			url: '/builds/:buildId',
			templateUrl: 'modules/builds/views/view-build.client.view.html'
		}).
		state('editBuild', {
			url: '/builds/:buildId/edit',
			templateUrl: 'modules/builds/views/create-build.client.view.html'
		});
	}
]);