'use strict';

// Champions controller
angular.module('champions').controller('ChampionsController', ['$scope', '$stateParams', '$location',
	'Authentication', 'Champions', 'Repository', 'ngToast',
	function($scope, $stateParams, $location, Authentication, Champions, Repository, ngToast) {
		$scope.authentication = Authentication;

		// Create new Champion
		$scope.create = function() {
			// Create new Champion object
			var champion = new Champions ({
				name: this.name
			});

			// Redirect after save
			champion.$save(function(response) {
				$location.path('champions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Champion
		$scope.remove = function(champion) {
			if ( champion ) {
				champion.$remove();

				for (var i in $scope.champions) {
					if ($scope.champions [i] === champion) {
						$scope.champions.splice(i, 1);
					}
				}
			} else {
				$scope.champion.$remove(function() {
					$location.path('champions');
				});
			}
		};

		// Update existing Champion
		$scope.update = function() {
			var champion = $scope.champion;

			champion.$update(function() {
				$location.path('champions/' + champion._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Patches
		$scope.find = function() {
			$scope.champions = Repository.getCachedChampions();
		};

		// Find existing Champion
		$scope.findOne = function() {
			$scope.champion = Champions.get({
				championId: $stateParams.championId
			});
		};

		$scope.search = {
			attributes: {
				name: '',
			},
		};
		// Find existing Champions
		$scope.searchChampion = function(search) {
			$scope.busy = true;
			Champions.data.query(search.attributes)
				.$promise.then(function(data) {
					$scope.champions = data;
					$scope.busy = false;
			    });
		};

		/**
		 * Ask server to check for new champions
		 */
		$scope.checkChampions = function(clickEvent){
			var btn = $(clickEvent.currentTarget);
			btn.button('loading');
			Champions.checkChampions.get(function(res){
				var report = '';
				btn.button('reset');
				if(!res.force) return;

				$scope.champions = [];
				Repository.clearPagination();
				updateChampions();

				if(res.inserted == 0){
					report = 'Report: No new champions found :(';
				}else {
					report = 'Report: Inserted ' + res.inserted + ' champions :)';
				}

				ngToast.create({
					content: 			report,
					dismissButton: 		true,
					dismissOnTimeout: 	false
				});
			});
		};

		/**
		 * Method in charge of updating the champions variable in the current scope
		 * @param  {[type]} force [description]
		 * @return {[type]}       [description]
		 */
		function updateChampions(){
			$scope.busy     = true;
			Repository.getChampions().then(function(data) {
				for (var i = 0 ; i < data.champions.length; i++) {
					$scope.champions.push(data.champions[i]);
				};
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
    		updateChampions();
		};

	}
]);