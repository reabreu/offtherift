'use strict';

// Patches controller
angular.module('patches').controller('PatchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Patches','Repository','ngToast',
	function($scope, $stateParams, $location, Authentication, Patches, Repository,ngToast) {
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
			Patches.data.update( {id : patch._id}, patch);
		}

		$scope.synchPatch = function (clickEvent, patch) {

			var btn = $(clickEvent.currentTarget);
			btn.button('loading');

			//emitir pedido de sincro
			Repository.sincronizePatch(patch).then(function(data) {
				var report = '';

				btn.button('reset');
				$scope.patches = [];

				Repository.clearPagination();
				updatePatches();

				for(var key in data.report){
					report += key + ': ' + data.report[key].inserted + ' inserted and ' + data.report[key].updated + ' updated.<br>';	
				}

				ngToast.create({
					content: report
				});
			});
		}

		/**
		 * Ask server to check for new patches
		 * @return {[type]} [description]
		 */
		$scope.checkPatches = function(clickEvent){
			var btn = $(clickEvent.currentTarget);
			btn.button('loading');
			Patches.checkPatches.get(function(res){
				var report = '';
				btn.button('reset');
				if(!res.force) return;

				$scope.patches = [];
				Repository.clearPagination();
				updatePatches();

				if(res.inserted == 0){
					report = 'Report: No new patches found :(';
				}else {
					report = 'Report: Inserted ' + res.inserted + ' patches :)';
				}

				ngToast.create({
					content: 			report,
					dismissButton: 		true,
					dismissOnTimeout: 	false
				});
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