'use strict';

angular.module('patch').controller('PatchController', ['$scope','patchService',
	function($scope,patchService) {
		
		$scope.patches 			= patchService.patches;
		$scope.patches_order 	= patchService.patches_order;

		$scope.changePatchState = function( version ){
			patchService.changePatchState(version);
		}

		$scope.synchPatch	 	= function ( version ){
			patchService.synchPatch(version);
		}
	}
]);