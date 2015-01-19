'use strict';

angular.module('item').controller('ItemDetailsController', ['$scope','$stateParams','itemService',
	function($scope,$stateParams,itemService) {
		// Controller Logic
		$scope.item_id 	= $stateParams.item_id;
		$scope.item 	= itemService.items[$scope.item_id];
	}
]);