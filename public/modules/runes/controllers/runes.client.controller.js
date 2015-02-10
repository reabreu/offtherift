'use strict';

// Runes controller
angular.module('runes').controller('RunesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Runes', 'Repository',
	function($scope, $stateParams, $location, Authentication, Runes, Repository) {
		$scope.Authentication 	= Authentication;
		$scope.busy 			= false;
		$scope.patches  		= [];
		$scope.runes 			= [];

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
			loadRunes();
		}

		$scope.searchRunes = function(){
			//Se for uma nova pesquisa, limpamos os dados
			Repository.clearRunePagination();
			$scope.runes 	= [];
			loadRunes();
		}

		/**
		 * Load more runes,
		 * @return {[type]} [description]
		 */
		$scope.loadMore = function() {
			if ($scope.busy) return;
    		loadRunes();
		}

		function loadRunes(){
			$scope.busy 	= true;
			Repository.getRunes( $scope.formData ).then(function(data) {
				for (var i = 0 ; i < data.runes.length; i++) {
					$scope.runes.push(data.runes[i]);
				};

				// Don't allow more requests after reaching the last one.
			    $scope.busy 	= data.full;
			    $scope.full 	= data.full;
			});
		}

		$scope.setCurrentRuneIndex= function(index){
			$scope.runeIndex = index;
		}

		// Update existing Rune
		$scope.update = function( rune ) {
			rune.$update(function() {
				$('#runeModal').modal('hide')
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Runes
		// $scope.find = function() {
		// 	$scope.runes = Runes.query();
		// };

		// Find existing Rune
		// $scope.findOne = function() {
		// 	$scope.rune = Runes.get({ 
		// 		runeId: $stateParams.runeId
		// 	});
		// };

		// Create new Rune
		// $scope.create = function() {
		// 	// Create new Rune object
		// 	var rune = new Runes ({
		// 		name: this.name
		// 	});

		// 	// Redirect after save
		// 	rune.$save(function(response) {
		// 		$location.path('runes/' + response._id);

		// 		// Clear form fields
		// 		$scope.name = '';
		// 	}, function(errorResponse) {
		// 		$scope.error = errorResponse.data.message;
		// 	});
		// };

		// Remove existing Rune
		// $scope.remove = function(rune) {
		// 	if ( rune ) { 
		// 		rune.$remove();

		// 		for (var i in $scope.runes) {
		// 			if ($scope.runes [i] === rune) {
		// 				$scope.runes.splice(i, 1);
		// 			}
		// 		}
		// 	} else {
		// 		$scope.rune.$remove(function() {
		// 			$location.path('runes');
		// 		});
		// 	}
		// };
	}
]);