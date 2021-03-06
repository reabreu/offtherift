'use strict';

// Champions controller
angular.module('champions').controller('ChampionsController', ['$scope', '$stateParams', '$location',
	'Authentication', 'Champions', 'Repository', '$modal',
	function($scope, $stateParams, $location, Authentication, Champions, Repository, $modal) {
		$scope.authentication 	= Authentication;
		$scope.busy 			= false;
		$scope.patches  		= [];
		$scope.champions 		= [];
		$scope.copyPatch 		= { version : ''};

		$scope.formData 		= {
			enabled: 	false,
			name: 		null,
			version: 	null,
		};

		$scope.init = function() {
			$scope.formData.version = "";
			$scope.patches 			= Repository.getCachedPatches();

			if($scope.patches.length == 0){
				Repository.getPatches().then(function(data) {
					$scope.patches = data.patches;
				});
			}
			loadChampions();
		};

		$scope.searchChampions = function(){
			//Se for uma nova pesquisa, limpamos os dados
			Repository.clearChampionPagination();
			$scope.champions = [];
			loadChampions();
		};

		/**
		 * Method in charge of updating the champions variable in the current scope
		 * @param  {[type]} force [description]
		 * @return {[type]}       [description]
		 */
		function loadChampions(){
			$scope.busy     = true;
			Repository.getChampions($scope.formData).then(function(data) {
				for (var i = 0 ; i < data.champions.length; i++) {
					$scope.champions.push(data.champions[i]);
				}
			    $scope.busy 	= data.full;
			    $scope.full 	= data.full;
			});
		}

		/**
		 * Load more champions, the number of champions can be configured in the repository
		 * @return {[type]} [description]
		 */
		$scope.loadMore = function() {
			if ($scope.busy) return;
    		loadChampions();
		};

		/**
		 * Show champion details
		 * @param  {@object} champion Champion Details
		 */
		$scope.openModal = function (champion) {
			$scope.champion = champion;

			$scope.modal = $modal.open({
				scope: $scope,
				templateUrl: 'modules/champions/views/edit-champion.client.view.html',
				controller:  'ChampionsController',
				size: 'lg',
      			windowClass: "modal fade",
				resolve: {
					champion: champion,
					champions: function () {
			          return $scope.champions;
			        }
				}
			});
		};
		/**
		 * Close current opened Modal
		 */
		$scope.closeModal = function () {
			$scope.modal.close();
		};

		// Update existing Item
		$scope.update = function( champion ) {
			champion.$update(function() {
				$scope.modal.close();
				$scope.searchChampions();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.loadEffects = function(){
			champion.data.query({
				version: 	$scope.copyPatch.version,
				riotId: 	$scope.champion.id
			}).$promise.then(function(data){
				$scope.champion.spells = data[0].spells;
			});
		}
	}
]);
