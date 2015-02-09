'use strict';

// Items controller
angular.module('items').controller('ItemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Items', 'Repository',
	function($scope, $stateParams, $location, Authentication, Items,Repository) {
		$scope.authentication 	= Authentication;
		$scope.busy 			= false;
		$scope.patches  		= [];
		$scope.items 			= [];

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
		}

		$scope.searchItems = function(){
			//Se for uma nova pesquisa, limpamos os dados
			Repository.clearItemPagination();
			$scope.items 	= [];
			loadItems();
		}

		/**
		 * Load more items,
		 * @return {[type]} [description]
		 */
		$scope.loadMore = function() {
			if ($scope.busy) return;
    		loadItems();
		}

		function loadItems(){
			$scope.busy 	= true;
			Repository.getItems( $scope.formData ).then(function(data) {
				for (var i = 0 ; i < data.items.length; i++) {
					$scope.items.push(data.items[i]);
				};
			    $scope.busy 	= data.full;
			    $scope.full 	= data.full;
			});
		}

		$scope.setCurrentItemIndex= function(index){
			$scope.itemIndex = index;
		}

		// Update existing Item
		$scope.update = function( item ) {
			item.$update(function() {
				$('#itemModal').modal('hide')
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);