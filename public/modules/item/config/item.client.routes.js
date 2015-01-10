'use strict';

//Setting up route
angular.module('item').config(['$stateProvider',
	function($stateProvider) {
		// Item state routing
		$stateProvider.
		state('item', {
			url: '/item',
			templateUrl: 'modules/item/views/indexitem.client.view.html'
		}).
		state('item.details', {
			url: '/{item_id:[0-9]+}',
			templateUrl: 'modules/item/views/item-details.client.view.html'
		});
	}
]);