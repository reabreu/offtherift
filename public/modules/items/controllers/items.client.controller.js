'use strict';

// Items controller
angular.module('items').controller('ItemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Items', 'Repository',
	function($scope, $stateParams, $location, Authentication, Items,Repository) {
		$scope.authentication 	= Authentication;
		$scope.busy 			= false;
		$scope.items 			= [];
		$scope.formData 		= {
			enabled: 	false,
			name: 		null,
			version: 	null,
		};

		$scope.init = function() {
			$scope.patches 		= Repository.getCachedPatches();

			if($scope.patches.length == 0){
				Repository.getPatches().then(function(data) {
					$scope.patches = data.patches;
				});
			}
		};

		$scope.searchItems = function(clickEvent){
			var btn = $(clickEvent.currentTarget);

			//Se for uma nova pesquisa, limpamos os dados
			Repository.clearItemPagination();
			$scope.items 	= [];
			
			btn.button('loading');
			loadItems();
			btn.button('reset');
		}

		/**
		 * Load more items,
		 * @return {[type]} [description]
		 */
		$scope.loadMore = function() {
			if ($scope.busy) return;
    		loadItems();
		};

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

		// Create new Item
		/*$scope.create = function() {
			// Create new Item object
			var item = new Items ({
				name: this.name
			});

			// Redirect after save
			item.$save(function(response) {
				$location.path('items/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Item
		$scope.remove = function(item) {
			if ( item ) { 
				item.$remove();

				for (var i in $scope.items) {
					if ($scope.items [i] === item) {
						$scope.items.splice(i, 1);
					}
				}
			} else {
				$scope.item.$remove(function() {
					$location.path('items');
				});
			}
		};

		// Update existing Item
		$scope.update = function() {
			var item = $scope.item;

			item.$update(function() {
				$location.path('items/' + item._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Items
		$scope.find = function() {
			$scope.items = Items.query();
		};

		// Find existing Item
		$scope.findOne = function() {
			$scope.item = Items.get({ 
				itemId: $stateParams.itemId
			});
		};*/
	}
]);