'use strict';

angular.module('item').controller('ItemController', ['$scope','patchService','itemService',
	function($scope, patchService, itemService ) {

		$scope.patches 			= patchService.patches;
		$scope.patches_order 	= patchService.patches_order;
		$scope.selectedPatch 	= patchService.curr_patch;
		$scope.items 			= itemService.items;

		$scope.getItems = function(){			
			itemService.getItems( $scope.selectedPatch );
			patchService.setCurrentPatch($scope.selectedPatch);
		}

		$scope.$watch(
			//value function
			function(scope) { 
				return itemService.items;
			},
			//listener function
			function(newValue, oldValue) {
				$scope.items = newValue;
			}
		);

		$scope.$watch(
			//value function
			function(scope) { 
				return patchService.curr_patch;
			},
			//listener function
			function(newValue, oldValue) {
				$scope.curr_patch = newValue;
			}
		);
	}
]);