'use strict';

// Builds controller
angular.module('builds').controller('BuildsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Builds', 'Repository','$modal','Calculate', 'ngProgress','$timeout','$state',
	function($scope, $stateParams, $location, Authentication, Builds, Repository,$modal,Calculate,ngProgress,$timeout,$state) {
		$scope.authentication 	= Authentication;

		$scope.init = function(){
			$scope.enabledView = false;

			$scope.build 			= {
				visible: 			false,
				name: 				null,
				champion_id: 		null,
				version: 			null,
				runes: 				{
					mark : 			[],
					glyph : 		[],
					quintessence: 	[],
					seal: 			[]
				},
				runes_aux: {
					runeCount: {}
				},
				masteries: 			[],
				masteries_aux: 		{
					avaliable_points: 30,
					points : {
						offense:  0,
						defense:  0,
						utility:  0
					},
					enabled: 	{
						offense: 4,
						defense: 4,
						utility:  4
					}
				},
				snapshot: 			[],
				calculatedStats: 	[]
			};

			// Data
			$scope.data = {
				currentSnapshot		: 0,
				timer				: null,
				champions 			: [],
				items 				: [],
				runes 				: [],
				masteries 			: [],
				patches 			: Repository.getCachedPatches(),
				selectedPatch 		: null,
				selectedChampion 	: null,
			};

			$scope.enabledView = false;

			ngProgress.start();
			if (!$scope.data.patches.length) {
				Repository.getPatches().then(function(data){
					$scope.data.patches 		= data.patches;
					$scope.initBuild();
				});
			} else {
				$scope.initBuild();
			}

			$scope.$watch('build.snapshot', function (newVal) {
				$scope.evaluateStatsRequest();
			}, true);

			$scope.$watch('build.runes', function (newVal) {
				$scope.evaluateStatsRequest();
			}, true);

			$scope.$watch('build.masteries', function (newVal) {
				$scope.evaluateStatsRequest();
			}, true);

			$scope.$watch('build.champion_id', function (newVal) {
				$scope.evaluateStatsRequest();
			}, true);
		}

		$scope.initBuild = function() {
			if ($state.current.name == "editBuild") {
				$scope.Buildmode="edit";
				$scope.findOne();
			} else {
				$scope.Buildmode="create";
				$scope.build.version =  $scope.data.selectedPatch 	= $scope.data.patches[0].version;
				$scope.getPatchInfo();
			}
		}

		// Find existing Build
		$scope.findOne = function() {
			Builds.get({buildId: $stateParams.buildId}, function(data) {

				$scope.build 				= data.data;
				if ($state.current.name != "viewBuild") {
					$scope.data.selectedPatch 	= $scope.build.version;
					var params 					= {version: $scope.data.selectedPatch, riotId: $scope.build.champion_id, data: true };

					Repository.getChampions(params).then(function(data) {
						$scope.data.selectedChampion 	= data.champions[0];
						$scope.getPatchInfo();
					});
				}
			});
		};

		/**
		 * Load patch information needed for build
		 */
		$scope.getPatchInfo = function(){
			Repository.setSelectedPatch($scope.data.selectedPatch);
			var params = {version: $scope.data.selectedPatch, build: true };

			Repository.getChampions(params).then(function(data) {
				$scope.data.champions 			= data.champions;

				Repository.getItems(params).then(function(data) {
					$scope.data.items 		= data.items;

					Repository.getRunes(params).then(function(data) {
						$scope.data.runes 		= data.runes;

						Repository.getMasteries(params).then(function(data) {
							$scope.data.masteries 	= data.masteries;

							//Prego do Ruben
							$scope.data.masteries.push({id:4153, masteryTree:'Offense'});
							$scope.data.masteries.push({id:4161, masteryTree:'Offense'});
							$scope.data.masteries.push({id:4223, masteryTree:'Defense'});
							$scope.data.masteries.push({id:4254, masteryTree:'Defense'});
							$scope.data.masteries.push({id:4261, masteryTree:'Defense'});
							$scope.data.masteries.push({id:4321, masteryTree:'Utility'});
							$scope.data.masteries.push({id:4351, masteryTree:'Utility'});
							$scope.data.masteries.push({id:4354, masteryTree:'Utility'});
							$scope.data.masteries.push({id:4361, masteryTree:'Utility'});

							angular.forEach($scope.data.masteries, function(masterie, index) {
								masterie.points = 0;
							});

							if ($state.current.name == "editBuild") {
								//popular as masteires com os pontos atribuidos na build
								for (var i = 0; i <  $scope.build.masteries.length; i++ ) {
									for (var z = 0; z <  $scope.data.masteries.length; z++ ) {
										if ($scope.build.masteries[i].id == $scope.data.masteries[z].id){
											$scope.data.masteries[z].points = parseInt($scope.build.masteries[i].customEffect.rank);
											break;
										}
									}
								}
							}

							$scope.enabledView = true;
							ngProgress.complete();
						});
					});
				});
			});

			ngProgress.complete();
		}

		$scope.evaluateBuildStatus = function(){
			if ($scope.build.champion_id === null || $scope.build.version === null || $scope.build.name === null || $scope.build.name === undefined) return false;
			return true;
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

			buildService.$update(function() {
				$location.path('builds/' + $scope.build._id + '/edit');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Builds
		$scope.find = function() {
			$scope.builds = Builds.query();
		};

		/**
		 * Generate an array of number to loop with ng-repeat
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
		 */
		$scope.setSelectedChampion = function(champion){
			var params = {version: $scope.data.selectedPatch, riotId: champion.id, data: true };
			ngProgress.start();
			Repository.getChampions(params).then(function(data) {
				$scope.data.selectedChampion 	= data.champions[0];
				$scope.build.champion_id = champion.id;
				ngProgress.complete();
			});
		};

		/**
		 * [calculate Calculate the stats of current build]
		 * @return {[type]}
		 */
		$scope.calculate = function(){
			var request = {
				partype: 	$scope.data.selectedChampion.partype,
				level: 		$scope.build.snapshot[$scope.data.currentSnapshot].level,
				stats: 		$scope.data.selectedChampion.stats,
				effects: 	[]
			};

			//popular com os efeitos dos items
			angular.forEach($scope.build.snapshot[$scope.data.currentSnapshot].items, function(value, key) {
				request.effects = request.effects.concat(value.customEffect);
			});

            // adicionar efeito do trinket
            var trinket = $scope.build.snapshot[$scope.data.currentSnapshot].trinket;
            if (trinket != null) {
                request.effects = request.effects.concat(trinket.customEffect);
            }

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
			Calculate.save(request).$promise.then(function(response) {
				$scope.build.calculatedStats[$scope.data.currentSnapshot] = response.data;
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
	}
]);
