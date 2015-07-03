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
		state('listBuildsByVersionOrChampion', {
			url: '/browse/:target',
			templateUrl: 'modules/builds/views/list-builds.client.view.html'
		}).
		state('listBuildsByChampionAndVersion', {
			url: '/browse/:champion/:version',
			templateUrl: 'modules/builds/views/list-builds.client.view.html'
		}).
		state('createBuild', {
			url: '/builds/create',
			templateUrl: 'modules/builds/views/create-build.client.view.html'
		}).
		state('viewBuild', {
			url: '/builds/:build_name/:buildId',
			templateUrl: 'modules/builds/views/view-build.client.view.html'
		}).
		state('editBuild', {
			url: '/builds/:build_name/:buildId/edit',
			templateUrl: 'modules/builds/views/create-build.client.view.html',
			resolve: {
				load: ['$q', 'Authentication', '$state','$timeout','Urlprotection', function($q, Authentication, $state, $timeout, Urlprotection ) {
					return Urlprotection.checkSendToHome($q, Authentication, $state, $timeout);
				}]
			}
		});
	}
]);