'use strict';

// Masteries controller
angular.module('masteries').controller('MasteriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Masteries','Repository','$modal',
	function($scope, $stateParams, $location, Authentication, Masteries, Repository,$modal) {
		$scope.authentication 	= Authentication;
		$scope.busy 			= false;
		$scope.patches  		= [];
		$scope.masteries 		= [];
		$scope.copyPatch 		= { version : ''};

		$scope.formData 		= {
			enabled: 	false,
			name: 		null,
			version: 	null,
		}

		$scope.init = function() {
			$scope.formData.version = "";
			$scope.patches 			= Repository.getCachedPatches();

			if($scope.patches.length == 0){
				Repository.getPatches().then(function(data) {
					$scope.patches = data.patches;
				});
			}
			loadMasteries();
		}

		$scope.searchMasteries = function(){
			//Se for uma nova pesquisa, limpamos os dados
			Repository.clearMasteriesPagination();
			$scope.masteries 	= [];
			loadMasteries();
		}

		$scope.loadMore = function() {
			if ($scope.busy) return;
    		loadMasteries();
		}

		function loadMasteries(){
			$scope.busy 	= true;
			Repository.getMasteries( $scope.formData ).then(function(data) {
				for (var i = 0 ; i < data.masteries.length; i++) {
					$scope.masteries.push(data.masteries[i]);
				};
			    $scope.busy 	= data.full;
			    $scope.full 	= data.full;
			});
		}

		$scope.openModal = function (masterie) {
			$scope.masterie = masterie;

			$scope.modal = $modal.open({
				scope: $scope,
				templateUrl: 'modules/masteries/views/edit-masterie.client.view.html',
				controller:  'MasteriesController',
				size: 'lg',
      			windowClass: "modal fade",
				resolve: {
					masterie: masterie
				}
			});
		}

		/**
		 * Close current opened Modal
		 */
		$scope.closeModal = function () {
			$scope.modal.close();
		};

		// Update existing Item
		$scope.update = function( masterie ) {
			masterie.$update(function() {
				$scope.modal.close();
				$scope.searchMasteries();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.loadEffects = function(){
			Masteries.data.query({
				version: 	$scope.copyPatch.version,
				riotId: 	$scope.masterie.id
			}).$promise.then(function(data){
				$scope.masterie.customEffect = data[0].customEffect;
			});
		}
	}
]);