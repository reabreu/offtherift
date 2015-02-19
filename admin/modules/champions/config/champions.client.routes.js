'use strict';

//Setting up route
angular.module('champions').config(['$stateProvider',
	function($stateProvider) {
		// Champions state routing
		$stateProvider.
		state('listChampions', {
			url: '/champions',
			templateUrl: 'modules/champions/views/list-champions.client.view.html'
		}).
		state('createChampion', {
			url: '/champions/create',
			templateUrl: 'modules/champions/views/create-champion.client.view.html'
		}).
		state('viewChampion', {
			url: '/champions/:championId',
			templateUrl: 'modules/champions/views/view-champion.client.view.html'
		}).
		state('editChampion', {
			url: '/champions/:championId/edit',
			templateUrl: 'modules/champions/views/edit-champion.client.view.html'
		});
	}
]);