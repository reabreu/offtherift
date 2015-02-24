'use strict';

//Setting up route
angular.module('masteries').config(['$stateProvider',
	function($stateProvider) {
		// Masteries state routing
		$stateProvider.
		state('listMasteries', {
			url: '/masteries',
			templateUrl: 'modules/masteries/views/list-masteries.client.view.html'
		}).
		state('createMasterie', {
			url: '/masteries/create',
			templateUrl: 'modules/masteries/views/create-masterie.client.view.html'
		}).
		state('viewMasterie', {
			url: '/masteries/:masterieId',
			templateUrl: 'modules/masteries/views/view-masterie.client.view.html'
		}).
		state('editMasterie', {
			url: '/masteries/:masterieId/edit',
			templateUrl: 'modules/masteries/views/edit-masterie.client.view.html'
		});
	}
]);