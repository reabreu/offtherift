'use strict';

// Builds controller
angular.module('builds').controller('BuildsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Builds', 'Repository','$modal','Calculate', 'ngProgress','$timeout','$state','$window','blockUI',
	function($scope, $stateParams, $location, Authentication, Builds, Repository,$modal,Calculate,ngProgress,$timeout,$state,$window,blockUI) {
		$scope.authentication 	= Authentication;
		ngProgress.height('3px');
		ngProgress.color('#89cff0');

		// Find existing Build
		$scope.findOne = function() {
            $scope.absUrl = $location.absUrl();

			Builds.get({buildId: $stateParams.buildId}, function(data) {
				$scope.build = data.data;
				if ($state.current.name != "viewBuild") {
					$scope.data.selectedPatch 	= $scope.build.version;
					var params 					= {version: $scope.data.selectedPatch, riotId: $scope.build.champion_id, data: true };
					Repository.getChampions(params).then(function(data) {
						$scope.data.selectedChampion 	= data.champions[0];
						$scope.getPatchInfo();
					});
				} else {
					FB.XFBML.parse();
				}
			});
		};

		$scope.setConfigHeight = function(){
			var windowHeight = $window.innerHeight;
			angular.element('.configuration-wrapper').height(windowHeight - 115);
		};

		/**************************
		* Build Creation/Editing  *
		* ************************/
		$scope.initBuild = function(){
			$scope.children = {items: null, runes: null, masteries: null};

			$scope.blockSnapshot 	= false;
			$scope.enabledView 		= false;
			$scope.buildChanged 	= false;

			$scope.build 			= {
				visible: 			false,
				name: 				null,
				champion_id: 		null,
				champion: 			null,
				version: 			null,
				runes: 				{
					mark : 			[],
					glyph : 		[],
					quintessence: 	[],
					seal: 			[]
				},
				runes_aux: {
					runeCount: {

					}
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
				selectedChampion 	: null
			};

			$scope.blockBuilder();

			if ($scope.build.snapshot.length == 0)
				$scope.addSnapshot();

			if (!$scope.data.patches.length) {
				Repository.getPatches().then(function(data){
					$scope.data.patches 		= data.patches;
					$scope.setBuildMode();
				});
			} else {
				$scope.setBuildMode();
			}

			$scope.$watch('build.snapshot', function () {
				$scope.evaluateStatsRequest();
			}, true);

			$scope.$watch('build.runes', function () {
				$scope.evaluateStatsRequest();
			}, true);

			$scope.$watch('build.masteries', function () {
				$scope.evaluateStatsRequest();
			}, true);

			$scope.$watch('build.champion_id', function () {
				$scope.evaluateStatsRequest();
			}, true);

			var w = angular.element($window);

			w.bind('resize', function () {
				$scope.setConfigHeight();
			});
		};

		$scope.setVisibleMode = function(mode){
			$scope.build.visible = mode;
		}

		$scope.setBuildMode = function() {
			if ($state.current.name == "editBuild") {
				$scope.buildMode="edit";
				$scope.findOne();
			} else {
				$scope.buildMode="create";
				$scope.build.version =  $scope.data.selectedPatch 	= $scope.data.patches[0].version;
				$scope.getPatchInfo();
			}
		};

		$scope.setBuildChanged = function(mode){
			$scope.buildChanged = mode;
		}

		/**
		 * Load patch information needed for build
		 */
		$scope.getPatchInfo = function(){
			$scope.build.version = $scope.data.selectedPatch;
			Repository.setSelectedPatch($scope.data.selectedPatch);

			var params = {version: $scope.data.selectedPatch, build: true };

			Repository.getChampions(params).then(function(data) {
				$scope.data.champions 			= data.champions;

				Repository.getItems(params).then(function(data) {
					$scope.data.items 		= data.items;

					Repository.getRunes(params).then(function(data) {
						$scope.data.runes 		= data.runes;

						Repository.getMasteries(params).then(function(data) {
							var oldPoints = $scope.data.masteries.slice(); // copy old values
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
								if (!$scope.patchChanged) {
									masterie.points = 0;
								} else {
									masterie.points = oldPoints[index].points;
								}
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

							// Update build information with loaded patch.
							if (typeof($scope.patchChanged) !== 'undefined' && $scope.patchChanged) {
								// ORDER MATTERS! calculatedStats are calculated in the end for EACH snapshot.
								$scope.updateMasteries();
								$scope.updateRunes();
								$scope.updateSnapshots();
								$scope.patchChanged = false;
							}

							$scope.enabledView = true;
							$scope.unblockBuilder();
						});
					});
				});
			});

			$scope.unblockBuilder();
		};

		$scope.updateMasteries = function() {
			var buildMasteryCount = $scope.build.masteries.length;
			for (var iter = 0; iter < buildMasteryCount; iter++) {
				var currentMastery = $scope.build.masteries[iter];

				// Get the rank of the mastery.
				var rank = currentMastery.customEffect.rank;

				// Add the effects from the current patch.
				var masteryCount = $scope.data.masteries.length;
				for (var masteryIter = 0; masteryIter < masteryCount; masteryIter++) {
					if ($scope.data.masteries[masteryIter].id == currentMastery.id) {
						var mastery = $scope.data.masteries[masteryIter];
						if (rank <= mastery.customEffect.length && rank > 0) {
							currentMastery.customEffect = mastery.customEffect[rank-1];
						} else {
							currentMastery.customEffect.value = 0;
						}
						break;
					}
				}
			}
		};

		/**
		 * Updates the runes from last selected patch to the new one.
		 * @return
		 */
		$scope.updateRunes = function() {
			// Iterate through all the runes in the build to update them.
			for (var tag in $scope.build.runes) {
				var runes = $scope.build.runes[tag];
				var runeCount = runes.length;

				// Remove each item and add it again with updated info.
				for (var i = 0; i < runeCount; i++) {
					var runeid = runes[i].id;

					// Find the rune and add it to the build.
					var dataRuneCount = $scope.data.runes.length;
					for (var r = 0; r < dataRuneCount; r++) {
						if ($scope.data.runes[r].id == runeid) {
							// Remove the old rune.
							$scope.children.runes.removeRune(tag, runeId);
							// Add the new one.
							$scope.children.runes.addRune($scope.data.runes[r]);
							break;
						}
					}
				}
			}
		};

		/**
		 * Updates all the snapshots from last selected patch to the new one.
		 * @return
		 */
		$scope.updateSnapshots = function() {
			// Iterate through the snapshots to update the items.
			var snapCount = $scope.build.snapshot.length;
			for (var snapIter =  0; snapIter < snapCount; snapIter++) {
				var currentSnap = $scope.build.snapshot[snapIter];

				// Remove all the current items and re-add them with updated information.
				for (var counter = currentSnap.items.length - 1; counter >= 0 ; counter--) {
					var itemId = currentSnap.items[0].id;

					// Search for the item and add it if it exists.
					var itemCount = $scope.data.items.length;
					for (var itemIter = 0; itemIter < itemCount; itemIter++) {
						if ($scope.data.items[itemIter].id == itemId) {
							// Remove the information from the old item.
							$scope.children.items.removeItem(0, snapIter);
							// Add information from the new item.
							$scope.children.items.addItem($scope.data.items[itemIter], snapIter);
							break;
						}
					}
				}

				// Update the trinket
				if (currentSnap.trinket != null) {
					// Search for the item and add it if it exists.
					var itemCount = $scope.data.items.length;
					for (var itemIter = 0; itemIter < itemCount; itemIter++) {
						if ($scope.data.items[itemIter].id == currentSnap.trinket.id) {
							// Remove the information from the old item.
							$scope.children.items.removeItem(7);
							// Add information from the new item.
							$scope.children.items.addItem($scope.data.items[itemIter], snapIter);
							break;
						}
					}
				}

				$scope.calculate(snapIter, true);
			}
		};

		$scope.changePatch = function() {
			$scope.patchChanged = true;
			$scope.getPatchInfo();
		};

		/**
		 * Method responsible for checking whether a build can be savec
		 * @return Boolean
		 */
		$scope.evaluateBuildStatus = function(){
			if ($scope.build.champion_id === null || $scope.build.version === null || $scope.build.name === null || $scope.build.name === undefined ) return false;
			return true;
		};

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

		// Update existing Build
		$scope.update = function() {
			$scope.blockBuilder();
			var buildService = new Builds ($scope.build);

			buildService.$update(function() {
				$scope.buildChanged = false;
				$location.path('builds/' + $scope.build._id + '/edit');
				$scope.unblockBuilder();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
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
			$scope.blockBuilder();
			Repository.getChampions(params).then(function(data) {
				$scope.data.selectedChampion 	= data.champions[0];
				$scope.build.champion_id 		= champion.id;
				$scope.build.champion 			= $scope.data.selectedChampion._id;
				$scope.unblockBuilder();
			});
		};

		/**
		 * [calculate description]
		 * @param  {[type]} snapshot [description]
		 * @param  {[type]} block    Should the system be blocked?
		 * @return {[type]}          [description]
		 */
		$scope.calculate = function(snapshot, block){
			if (typeof(snapshot) === 'undefined') snapshot = $scope.data.currentSnapshot;

			if (typeof(block) === 'undefined' || block) $scope.blockBuilder();

			var request = {
				partype: 	$scope.data.selectedChampion.partype,
				level: 		$scope.build.snapshot[snapshot].level,
				stats: 		$scope.data.selectedChampion.stats,
				effects: 	[]
			};

			//popular com os efeitos dos items
			angular.forEach($scope.build.snapshot[snapshot].items, function(value, key) {
				request.effects = request.effects.concat(value.customEffect);
			});

            // adicionar efeito do trinket
            var trinket = $scope.build.snapshot[snapshot].trinket;
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

			Calculate.save(request).$promise.then(function(response) {
				$scope.build.calculatedStats[snapshot] = response.data;
				if (typeof(block) === 'undefined' || block) $scope.unblockBuilder();
				$scope.hoverOut();
				$scope.blockSnapshot = false;
			});
		};

		//Watchers para fazer o pedido
		$scope.evaluateStatsRequest = function(){
			if ($scope.data.selectedChampion === null) {
				return;
			}

			$scope.buildChanged 	= true;
			$scope.blockSnapshot	= true;

			$timeout.cancel($scope.data.timer);
			$scope.data.timer = $timeout($scope.calculate,1000);
		};

		$scope.hoverIn = function( object, event ){

			if( typeof(object.points) !== "undefined" && object.points == 0)
				return;

			angular.element('.stat-value-wrapper').addClass('stat-not-affected');

			angular.forEach(object.customEffect, function(effect, index){
				angular.element('.stat-value-' + effect.dest).addClass('affected');
			});

			angular.element('.item-slot img').addClass('stat-not-affected');
			angular.element('.rune-column-item img').addClass('stat-not-affected');
			angular.element('.mastery-item img').addClass('stat-not-affected');

			angular.element(event.target).addClass('affected');
		};

		$scope.hoverOut = function( event ){
		    angular.element('.stat-value-wrapper').removeClass('stat-not-affected');
		    angular.element('.stat-value-wrapper').removeClass('affected');
		    angular.element('.item-slot img').removeClass('stat-not-affected');
		    angular.element('.item-slot img').removeClass('affected');
		    angular.element('.rune-column-item img').removeClass('stat-not-affected');
		    angular.element('.rune-column-item img').removeClass('affected');
		    angular.element('.mastery-item img').removeClass('stat-not-affected');
		    angular.element('.mastery-item img').removeClass('affected');
		};

		$scope.addSnapshot = function(){
			var statTmp =  {
				hp: 'n/a',
				mp: 'n/a',
				hpregen: 'n/a',
				mpregen: 'n/a',
				attackdamage: 'n/a',
				abilitypower: 'n/a',
				armorpenetration: ['n/a','n/a'],
				magicpenetration:  ['n/a','n/a'],
				lifesteal: 'n/a',
				spellvamp: 'n/a',
				attackspeed: 'n/a',
				cooldownreduction: 'n/a',
				critchance: 'n/a',
				armor: 'n/a',
				attackrange: 'n/a',
				spellblock: 'n/a',
				movespeed: 'n/a',
				tenacity: 'n/a'
			};

			var snapTmp = {
				level: 	 1,
				items:   [],
				trinket: null,
				name: 	 ''
			};

			$scope.build.snapshot.push(snapTmp);
			$scope.build.calculatedStats.push(statTmp);
			var length = $scope.build.snapshot.length-1;
			$scope.setCurrentSnap(length);
		};

		$scope.removeSnapshot = function(index){

			if(index == $scope.data.currentSnapshot)
				$scope.data.currentSnapshot = 0;

			$scope.build.snapshot.splice(index, 1);
			$scope.build.calculatedStats.splice(index,1);
		}

		$scope.setCurrentSnap = function(index){
			$scope.data.currentSnapshot = index;
		};

		/**************************
		* Build Listing  		  *
		* ************************/
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

		$scope.initBuildBrowsing = function(){
			$scope.busy 	 = false;

			$scope.builds   = [];

			$scope.data 	= {
				patches: Repository.getCachedPatches()
			};

			$scope.search 	= {
				group : "mine",
				author: "",
				limit: 18,
				skip: 0
			};

			if (!$scope.data.patches.length) {
				Repository.getPatches().then(function(data){
					$scope.data.patches = data.patches;
					Repository.getChampions({version: $scope.data.patches[0].version}).then(function(data){
						$scope.data.champions = data.champions;
					});
				});
			} else {
				Repository.getChampions({version: $scope.data.patches[0].version}).then(function(data){
					$scope.data.champions = data.champions;
				});
			}
		};

		$scope.setGroup = function($event){
			$scope.search.group = $event.target.value;
		}

		$scope.loadMore = function() {
			if ($scope.busy) return;
    		$scope.searchBuilds();
		}

		$scope.resetAndSearchBuilds = function(){
			$scope.builds = [];
			$scope.search.skip = 0;
			$scope.searchBuilds();
		}

		$scope.searchBuilds = function(){
			ngProgress.start();
			$scope.busy = true;
			Builds.query($scope.search).$promise.then(function(data){
				var counter = 0;
                angular.forEach(data, function(build, index){
                    $timeout($scope.addBuild(build,$scope.builds), index * 100);
                });

                $scope.$on('fade-right:enter', function(){
                	counter++;
                	if(counter == data.length && data.length > 0){
                		$scope.busy 	= false;
                	}
			    });

                $scope.search.skip += $scope.search.limit;
				ngProgress.complete();
			});
		};

		// Find a list of Builds
		$scope.find = function() {
			$scope.builds = Builds.query();
		};

		$scope.addBuild = function(elem, container){
            return function(){
                container.push(elem);
            }
        };

        /**
         * Metodo responsavel por bloquear o builder
         * @return {[type]} [description]
         */
        $scope.blockBuilder = function(){
        	blockUI.start();
			ngProgress.start();
        }

        /**
         * Metodo responsavel por debloquear o builder
         * @return {[type]} [description]
         */

        $scope.unblockBuilder = function(){
        	ngProgress.complete();
			blockUI.stop();
        }
	}
]);
