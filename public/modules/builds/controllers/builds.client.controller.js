'use strict';

// Builds controller
angular.module('builds').controller('BuildsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Builds', 'Repository','$modal','Calculate', 'ngProgress','$timeout',
	function($scope, $stateParams, $location, Authentication, Builds, Repository,$modal,Calculate,ngProgress,$timeout) {
		$scope.authentication = Authentication;

		$scope.init = function(){
			//info que temos na view a uma dada altura
			$scope.data = {
				currentSnapshot		: 0,
				timer				: null,
				champions 			: [],
				items 				: [],
				runes 				: [],
				masteries 			: [],
				patches 			: Repository.getCachedPatches(),
				selectedPatch 		: Repository.getSelectedPatch(),
				selectedChampion 	: null,
			};

			//objeto build que sera vazio no caso de estarmos a criar uma nova build
			$scope.build = {
				visible: 			false,
				name: 				null,
				champion_id: 		null,
				version: 			null,
				runes: 				{},
				masteries: 			[],
				snapshot: 			[],
				calculatedStats: 	[]
			}

			if (!$scope.data.patches.length) {
				ngProgress.start();
				Repository.getPatches().then(function(data){
					$scope.data.patches 		= data.patches;
					$scope.build.version 		= $scope.data.selectedPatch 	= $scope.data.patches[0].version;
					$scope.getPatchInfo();
				});
			}
		}

		/**
		 * [getPatchInfo Load patch information needed for build]
		 * @return {[type]}
		 */
		$scope.getPatchInfo = function(){
			Repository.setSelectedPatch($scope.data.selectedPatch);
			var params = {version: $scope.data.selectedPatch, build: true };

			Repository.getChampions(params).then(function(data) {
				$scope.data.champions 			= data.champions;
				//$scope.data.selectedChampion 	= data.champions[parseInt(Math.random() * ($scope.data.champions.length))];

				Repository.getItems(params).then(function(data) {
					$scope.data.items 		= data.items;

					Repository.getRunes(params).then(function(data) {
						$scope.data.runes 		= data.runes;

						Repository.getMasteries(params).then(function(data) {
							$scope.data.masteries 	= data.masteries;

							for (var i = 0; i<$scope.data.masteries.length; i++) {
								$scope.data.masteries[i].points = 0;
							};
							$scope.data.masteries.push({id:4153, masteryTree:'Offense'});
							$scope.data.masteries.push({id:4161, masteryTree:'Offense'});
							$scope.data.masteries.push({id:4223, masteryTree:'Defense'});
							$scope.data.masteries.push({id:4254, masteryTree:'Defense'});
							$scope.data.masteries.push({id:4261, masteryTree:'Defense'});
							$scope.data.masteries.push({id:4321, masteryTree:'Utility'});
							$scope.data.masteries.push({id:4351, masteryTree:'Utility'});
							$scope.data.masteries.push({id:4354, masteryTree:'Utility'});
							$scope.data.masteries.push({id:4361, masteryTree:'Utility'});
						});
					});
				});
			});

			ngProgress.complete();
		}

		// Create new Build
		$scope.create = function() {

			$scope.buildService = new Builds ($scope.build);

			// Redirect after save
			$scope.buildService.$save(function(response) {
				$location.path('builds/' + response._id + '/edit');
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
			var buildService = new Builds ($scope.build);
			$scope.build.$update(function() {
				$location.path('builds/' + build._id + '/edit');
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
			$scope.build.snapshot[$scope.data.currentSnapshot].level = level;
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
			var params = {version: $scope.data.selectedPatch, riotId: champion.id, data: true };
			ngProgress.start();
			Repository.getChampions(params).then(function(data) {
				$scope.data.selectedChampion 	= data.champions[0];
				ngProgress.complete();
			});
		};

		/**
		 * [calculate Calculate the stats of current build]
		 * @return {[type]}
		 */
		$scope.calculate = function(){
			var request = {
				level: $scope.build.snapshot[$scope.data.currentSnapshot].level,
				stats: $scope.data.selectedChampion.stats,
				effects: []
			};

			//popular com os efeitos dos items
			angular.forEach($scope.build.snapshot[$scope.data.currentSnapshot].items, function(value, key) {
				request.effects = request.effects.concat(value.customEffect);
			});

			//popular com os efeitos das runes
			angular.forEach($scope.build.runes, function(runes, tipo) {
				angular.forEach(runes, function(rune, index) {
					request.effects = request.effects.concat(rune.customEffect);
				});
			});

			//popular com os efeitos das masteries
			angular.forEach($scope.build.masteries, function(masterie, index) {
				request.effects = request.effects.concat(masterie.customEffect);
			});

			ngProgress.start();
			Calculate.save(request).$promise.then(function(data) {
				$scope.build.calculatedStats[$scope.data.currentSnapshot] = data;
				ngProgress.complete();
			});
		};

		//Watchers para fazer o pedido
		$scope.evaluateStatsRequest = function(){

			if ($scope.data.selectedChampion === null) {
				return;
			}

			$timeout.cancel($scope.data.timer);
			$scope.data.timer = $timeout($scope.calculate,1500);
		};

		$scope.$watch('build.snapshot', function (newVal) {
			$scope.evaluateStatsRequest();
		}, true);

		$scope.$watch('build.runes', function (newVal) {
			$scope.evaluateStatsRequest();
		}, true);

		$scope.$watch('build.masteries', function (newVal) {
			$scope.evaluateStatsRequest();
		}, true);
	}
]);
