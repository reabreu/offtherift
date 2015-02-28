'use strict';

// Builds controller
angular.module('builds').controller('BuildsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Builds', 'Repository','$modal','Calculate', 'ngProgress',
	function($scope, $stateParams, $location, Authentication, Builds, Repository,$modal,Calculate,ngProgress) {
		$scope.authentication 	= Authentication;

		$scope.init = function(){
			$scope.data = {
				champions 			: [],
				items 				: [],
				runes 				: [],
				masteries 			: [],
				level 				: 1,
				patches 			: Repository.getCachedPatches(),
				selectedPatch 		: Repository.getSelectedPatch(),
				selectedChampion 	: null,
				calculatedStats 	: {
					hp:'n/a',
					mp:'n/a',
					hpregen:'n/a',
					mpregen:'n/a',
					attackdamage:'n/a',
					abilitypower:'n/a',
					armorpenetration:'n/a',
					magicpenetration:'n/a',
					lifesteal:'n/a',
					spellvamp:'n/a',
					attackspeed:'n/a',
					cooldownreduction:'n/a',
					critchance:'n/a',
					armor:'n/a',
					attackrange:'n/a',
					spellblock:'n/a',
					movespeed:'n/a',
					tenacity:'n/a'
				}
			};

			if (!$scope.data.patches.length) {
				ngProgress.start();
				Repository.getPatches().then(function(data){
					$scope.data.patches 		= data.patches;
					$scope.data.selectedPatch 	= $scope.data.patches[0].version;
					$scope.getPatchInfo();
				});
			}
		}

		// Create new Build
		$scope.create = function() {
			// Create new Build object
			var build = new Builds ({
				name: this.name
			});

			// Redirect after save
			build.$save(function(response) {
				$location.path('builds/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Build
		$scope.remove = function(build) {
			if ( build ) {
				build.$remove();

				for (var i in $scope.builds) {
					if ($scope.builds [i] === build) {
						$scope.builds.splice(i, 1);
					}
				}
			} else {
				$scope.build.$remove(function() {
					$location.path('builds');
				});
			}
		};

		// Update existing Build
		$scope.update = function() {
			var build = $scope.build;

			build.$update(function() {
				$location.path('builds/' + build._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Builds
		$scope.find = function() {
			$scope.builds = Builds.query();
		};

		// Find existing Build
		$scope.findOne = function() {
			$scope.build = Builds.get({
				buildId: $stateParams.buildId
			});
		};

		/**
		 * [range Generate an array of number to loop with ng-repeat]
		 * @param  {[type]}
		 * @param  {[type]}
		 * @param  {[type]}
		 * @return {[type]}
		 */
		$scope.range = function(min, max, step){
			step = step || 1;
			var input = [];
			for (var i = min; i <= max; i += step) input.push(i);
			return input;
	  	};

	  	/**
	  	 * [setLevel Set current build level]
	  	 * @param {[type]}
	  	 */
	  	$scope.setLevel = function (level) {
	  		$scope.data.level = level;
	  		$scope.calculate();
	  	}

	  	/**
	  	 * [getPatchInfo Load patch information needed for build]
	  	 * @return {[type]}
	  	 */
	  	$scope.getPatchInfo = function(){
	  		Repository.setSelectedPatch($scope.data.selectedPatch);

	  		var params = {version: $scope.data.selectedPatch };

	  		Repository.getChampions(params).then(function(data) {
				$scope.data.champions = data.champions;
				$scope.data.selectedChampion = data.champions[parseInt(Math.random() * ($scope.data.champions.length))];
				$scope.calculate();
			});
			Repository.getItems(params).then(function(data) {
				$scope.data.items = data.items;
			});
			Repository.getRunes(params).then(function(data) {
				$scope.data.runes = data.runes;
			});
			Repository.getMasteries(params).then(function(data) {
				$scope.data.masteries = data.masteries;
			});
	  	}

	  	/**
	  	 * [openModal Open modal]
	  	 * @param  {[type]}
	  	 * @return {[type]}
	  	 */
		$scope.openModal = function ( champions ) {
			$scope.modal = $modal.open({
				scope: $scope,
				templateUrl: 'modules/builds/views/select-champion.client.view.html',
				controller:  'BuildsController',
				size: 'lg',
      			windowClass: "modal fade",
				resolve: {
					data: function () {
				        return $scope.data;
				    }
				}
			});
		};

		/**
		 * [closeModal Close modal]
		 * @return {[type]}
		 */
		$scope.closeModal = function () {
			$scope.modal.close();
		};

		/**
		 * [setSelectedChampion setCurrentSelectedChammpion]
		 * @param {[type]}
		 */
		$scope.setSelectedChampion = function(champion){
			$scope.data.selectedChampion = champion;
			$scope.calculate();
		}

		/**
		 * [calculate Calculate the stats of current build]
		 * @return {[type]}
		 */
		$scope.calculate = function(){
			var request = {
				level: $scope.data.level,
				stats: $scope.data.selectedChampion.stats,
				effects: []
			};
			ngProgress.reset();
			ngProgress.start();
			Calculate.save(request).$promise.then(function(data) {
				$scope.data.calculatedStats = data;
				ngProgress.complete();
			});
		}
	}
]);