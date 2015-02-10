'use strict';

//Setting up route
angular.module('runes').config(['$stateProvider',
	function($stateProvider) {
		// Runes state routing
		$stateProvider.
		state('listRunes', {
			url: '/runes',
			templateUrl: 'modules/runes/views/list-runes.client.view.html'
		}).
		state('createRune', {
			url: '/runes/create',
			templateUrl: 'modules/runes/views/create-rune.client.view.html'
		}).
		state('viewRune', {
			url: '/runes/:runeId',
			templateUrl: 'modules/runes/views/view-rune.client.view.html'
		}).
		state('editRune', {
			url: '/runes/:runeId/edit',
			templateUrl: 'modules/runes/views/edit-rune.client.view.html'
		});
	}
]);