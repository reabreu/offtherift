'use strict';

// Runes controller
angular.module('runes').controller('RunesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Runes', 'Repository',
	function($scope, $stateParams, $location, Authentication, Runes, Repository) {
		$scope.Authentication 	= Authentication;
		$scope.busy 			= false;
		$scope.patches  		= [];
		$scope.runes 			= [];
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
				$('#runeModal').modal('hide');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.loadEffects = function(){
			Runes.data.query({
				version: 	$scope.copyPatch.version,
				riotId: 	$scope.runes[$scope.runeIndex].id
			}).$promise.then(function(data){
				$scope.runes[$scope.runeIndex].customEffect = data[0].customEffect;
			});
		}

	}
]);