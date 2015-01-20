'use strict';

// Patches controller
angular.module('patches').controller('PatchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Patches','Repository',
	function($scope, $stateParams, $location, Authentication, Patches, Repository) {
		$scope.authentication 	= Authentication;
		$scope.busy 			= false;

		// Find a list of Patches
		$scope.find = function() {
			$scope.patches 	= Repository.getCachedPatches();
		};

		/**
		 * Toggle Enabled
		 * @param  {boolean} attr Boolean
		 */
		$scope.toggleEnabled = function (patch) {
			patch.enabled = !patch.enabled;
			Patches.data.update( {id : patch._id}, patch);
		}

		$scope.synchPatch = function (patch) {
			patch.synched = true;
			Patches.data.update( {id : patch._id}, patch);
			// @TODO: Synch method DD
		}

		/**
		 * Ask server to check for new patches
		 * @return {[type]} [description]
		 */
		$scope.checkPatches = function(){
			Patches.checkPatches.get(function(res){
				if(!res.force) return;
				Repository.clearPagination();
				updatePatches();
			});
		}

		/**
		 * Load more patches, the number of patches can be configured in the repository
		 * @return {[type]} [description]
		 */
		$scope.loadMore = function() {

			if ($scope.busy) return;
    		updatePatches();
		};

		/**
		 * Method in charge of updating the patches variable in the current scope
		 * @param  {[type]} force [description]
		 * @return {[type]}       [description]
		 */
		function updatePatches(){
			$scope.busy 	= true;
			Repository.getPatches().then(function(data) {
				for (var i = 0 ; i < data.patches.length; i++) {
					$scope.patches.push(data.patches[i]);
				};
			    $scope.busy 	= data.full;
			    $scope.full 	= data.full;
			});
		}
	}
]);