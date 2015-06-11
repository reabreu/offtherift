'use strict';

// Builds controller
angular.module('builds').controller('BuildsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Builds', 'Repository','$modal','Calculate', 'ngProgress','$timeout','$state','$window','blockUI', '$otrModal', '$q','$rootScope','Pagetitle','Metainformation',
	function($scope, $stateParams, $location, Authentication, Builds, Repository,$modal,Calculate,ngProgress,$timeout,$state,$window,blockUI, $otrModal, $q, $rootScope, Pagetitle, Metainformation) {
		$scope.authentication 	= Authentication;
		/**
		 * Flags to contents states
		 * @type {Object}
		 */
		$scope.state = Repository.state;

		// Find existing Build
		$scope.findOne = function() {
            $scope.absUrl = $location.absUrl().replace("#", "%23");

			Builds.get({buildId: $stateParams.buildId}, function(data) {
				$scope.build = data.data;

				/*Meta Tags Configuration*/
				Metainformation.reset();
				Metainformation.appendMetaKeywords([$scope.build.displayName, $scope.build.version, $scope.build.champion.name, $scope.build.champion.title, $scope.build.name]);
				$rootScope.pageKeywords = Metainformation.metaKeywords();
				$rootScope.pageTitle 	= Pagetitle.setTitle($scope.build.name);

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

				if ($state.current.name == "viewBuild") {
					var params = {version: $scope.build.version, build: true };

					Repository.getMasteries(params).then(function(data) {
						var oldPoints = $scope.data.masteries.slice(); // copy old values
						$scope.data.masteries 	= data.masteries;

						$scope.pregoRuben();

						angular.forEach($scope.data.masteries, function(masterie, index) {
							masterie.points = 0;
						});

						$scope.populateMasteries();
					});
				}

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


		$scope.checkShowBigChampionSelection = function(){
			if($state.current.name == "editBuild" || !$scope.data.firstPick)
				return false;
			return true;
		}

		$scope.pregoRuben = function(){
			$scope.data.masteries.push({id:4153, masteryTree:'Offense'});
			$scope.data.masteries.push({id:4161, masteryTree:'Offense'});
			$scope.data.masteries.push({id:4223, masteryTree:'Defense'});
			$scope.data.masteries.push({id:4254, masteryTree:'Defense'});
			$scope.data.masteries.push({id:4261, masteryTree:'Defense'});
			$scope.data.masteries.push({id:4321, masteryTree:'Utility'});
			$scope.data.masteries.push({id:4351, masteryTree:'Utility'});
			$scope.data.masteries.push({id:4354, masteryTree:'Utility'});
			$scope.data.masteries.push({id:4361, masteryTree:'Utility'});
		}

		$scope.populateMasteries = function(){
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

		$scope.showSearch = function( buildMode ){
			if(buildMode == 'createBuild' || buildMode == 'editBuild'){
				return true;
			} else {
				return false;
			}
		}

		$scope.setConfigHeight = function(){
			var windowHeight = $window.innerHeight;
			angular.element('.configuration-wrapper').height(windowHeight - 110);
		};

		/**************************
		* Build Creation/Editing  *
		* ************************/
		$scope.initBuild = function(){
			Metainformation.reset();
			$rootScope.pageKeywords = Metainformation.metaKeywords();
			$rootScope.pageTitle = Pagetitle.setTitle('Build');
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
				firstPick 			: true,
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
					$scope.unblockBuilder();
				});
			} else {
				$scope.setBuildMode();
				$scope.unblockBuilder();
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
			var limitedParams = angular.extend({}, params, {
				limit: 30
			});

			$scope.blockBuilder();
			Repository.getChampions(limitedParams).then(function(data) {
				$scope.data.champions 			= data.champions;

				Repository.getMasteries(params).then(function(data) {
					var oldPoints = $scope.data.masteries.slice(); // copy old values
					$scope.data.masteries 	= data.masteries;

					//Prego do Ruben
					$scope.pregoRuben();

					angular.forEach($scope.data.masteries, function(masterie, index) {
						if (!$scope.patchChanged) {
							masterie.points = 0;
						} else {
							masterie.points = oldPoints[index].points;
						}
					});

					if ($state.current.name == "editBuild") {
						$scope.populateMasteries();
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

				if ($state.current.name == "editBuild") {
					$scope.populateMasteries();
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
					var runeId = runes[i].id;

					// Find the rune and add it to the build.
					var dataRuneCount = $scope.data.runes.length;
					for (var r = 0; r < dataRuneCount; r++) {
						if ($scope.data.runes[r].id == runeId) {
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
			$scope.patchChanged 	= true;
			$scope.buildChanged 	= true;
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
			$scope.modal = $otrModal.open({
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
		 * Load more champions
		 * @param {integer} skip Query skip
		 * @return {boolean}
		 */
		$scope.loadMoreChampions = function (skip) {
			if ($scope.state.champions.loading ||
				$scope.state.champions.full) return;

			var params = {
				version: $scope.data.selectedPatch,
				build: true,
				limit: 30,
				skip: skip
			};

			Repository.getChampions(params).then(function (data) {
				for (var i = 0; i < data.champions.length; i++) {
					$scope.data.champions.push(data.champions[i]);
				}
			});
		};

		/**
		 * Search for champion
		 * @param  {object} search Search Object
		 */
		$scope.searchChampion = function (search) {
			$scope.data.champions = [];
			$scope.state.champions.full = false;

			var params = angular.extend({}, {
				version: $scope.data.selectedPatch,
				build: true,
				limit: 30
			}, search);

			Repository.getChampions(params).then(function (data) {
				for (var i = 0; i < data.champions.length; i++) {
					$scope.data.champions.push(data.champions[i]);
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
			$scope.data.firstPick = false;
			var params = {version: $scope.data.selectedPatch, riotId: champion.id, data: true };
			$scope.blockBuilder();
			Repository.getChampions(params).then(function(data) {
				var changed = $scope.data.selectedChampion != null &&
								$scope.data.selectedChampion._id != data.champions[0]._id;

				$scope.data.selectedChampion 	= data.champions[0];
				$scope.build.champion_id 		= champion.id;
				$scope.build.champion 			= $scope.data.selectedChampion._id;
				if (changed) $scope.children.items.removeChampionItems();
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

			if( typeof(object) === "undefined" || object === null) return;

			if( typeof(object.points) !== "undefined" && object.points !== null && object.points == 0)
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

			$scope.blockBuilder();

			if ( build ) {
				for (var i in $scope.builds) {
					if ($scope.builds [i] === build) {
						$scope.builds.splice(i, 1);
						$scope.buildService = new Builds ($scope.builds [i]);
					}
				}

			} else {
				$scope.buildService = new Builds ($scope.build);
			}

			$scope.buildService.$remove(function() {
				$scope.unblockBuilder();
				$location.path('/browse');
			});
		};

		$scope.initBuildBrowsing = function(){

			Metainformation.reset();
			$rootScope.pageKeywords = Metainformation.metaKeywords();
			$rootScope.pageTitle 	= Pagetitle.setTitle('Browse Builds');

			$scope.busy 	 = true;
			$scope.full 	= false;

			$scope.builds   = [];

			$scope.data 	= {
				patches: Repository.getCachedPatches(),
				timer: null
			};

			$scope.search 	= {
				author: "",
				limit: 18,
				skip: 0
			};

			if($scope.authentication.user == ""){
				$scope.search.group = "public";
				$scope.tablength = 5;
			}else{
				$scope.search.group = "public";
				//$scope.search.group = "mine";
				$scope.tablength = 4;
			}

			if ($scope.data.patches.length == 0) {
				Repository.getPatches().then(function(data){
					$scope.data.patches = data.patches;
					$scope.setChampionSearchListing();

				});
			} else {
				$scope.setChampionSearchListing();
			}

			$scope.$watch('search.author', function () {
				if(!$scope.busy)
					$scope.evaluateAuthorSearch();
			}, true);
		};

		$scope.evaluateAuthorSearch = function(){
			$timeout.cancel($scope.data.timer);
			$scope.data.timer = $timeout($scope.resetAndSearchBuilds,1000);
		};

		$scope.setChampionSearchListing = function(){

			Repository.getChampions({version: $scope.data.patches[0].version, build: true}).then(function(data){

				$scope.data.champions = data.champions;

				if( typeof($stateParams.target) !== 'undefined'){
					//check if its champion or patch
					if($stateParams.target.indexOf('.') !== -1){
						$scope.search.version = $scope.checkValidPatch($stateParams.target);
					} else {
						$scope.search.champion_id = $scope.checkValidChampion($stateParams.target);
					}
				}

				if( typeof($stateParams.champion) !== 'undefined'){
					$scope.search.champion_id = $scope.checkValidChampion($stateParams.champion);
				}

				if( typeof($stateParams.version) !== 'undefined'){
					$scope.search.version = $scope.checkValidPatch($stateParams.version);
				}

				$scope.busy 	 = false;

				$scope.loadMore();
			});
		}

		$scope.checkValidChampion = function( champion ) {
			var champ_id = '';

			for (var i = $scope.data.champions.length - 1; i >= 0; i--) {
				if( champion  == $scope.data.champions[i].key){
					champ_id = $scope.data.champions[i].id;
					break;
				}
			};
			return champ_id;
		}

		$scope.checkValidPatch = function( target_patch ){
			var patch_version = '';

			angular.forEach($scope.data.patches, function(patch, index){
                if( target_patch == patch.version ){
                	patch_version = patch.version;
                }
            });
			return patch_version;
		}

		$scope.setGroup = function(group){
			$scope.search.group = group;
			$scope.resetAndSearchBuilds();
		}

		$scope.resetAndSearchBuilds = function(){
			$scope.builds = [];
			$scope.full = false;
			$scope.busy = false;
			$scope.loadMore();
		}

		$scope.loadMore = function() {
			if ($scope.busy || $scope.full) return;
    		$scope.searchBuilds();
		}

		$scope.searchBuilds = function(){
			ngProgress.start();

			$scope.busy 		= true;
			$scope.search.skip 	= $scope.builds.length;

			Builds.query($scope.search).$promise.then(function(data){
				var counter = 0;

				if(data.length == 0){
					$scope.busy = false;
					$scope.full = true;

				} else {
					angular.forEach(data, function(build, index){
	                    $timeout($scope.addBuild(build,$scope.builds), index * 100);
	                });

	                $scope.$on('fade-right:enter', function(){
	                	counter++;
	                	if(counter == data.length){
	                		$scope.busy 	= false;
	                	}
				    });
				}

				ngProgress.complete();
			});
		};

		$scope.setUrlParams = function(){
			var dest_path = "/browse/";

			if(
				   typeof($scope.search.version)     	!== 'undefined'
				&& typeof($scope.search.champion_id) 	!== 'undefined'
				&& $scope.search.champion_id 			!= ''
				&& $scope.search.version 				!= ''
				&& $scope.search.champion_id 			!= null
				&& $scope.search.version 				!= null
				){
				dest_path += $scope.getChampionById($scope.search.champion_id) + "/" + $scope.search.version;
			}

			else if( typeof($scope.search.champion_id) !== 'undefined' && $scope.search.champion_id != '' && $scope.search.champion_id != null){
				dest_path += $scope.getChampionById($scope.search.champion_id);
			}

			else if( typeof($scope.search.version) !== 'undefined'  && $scope.search.version != '' && $scope.search.version != null){
				dest_path += $scope.search.version;
			}

			$location.path(dest_path).replace();
		}

		$scope.getChampionById = function( id ){
			for (var i = $scope.data.champions.length - 1; i >= 0; i--) {
				if( id  == $scope.data.champions[i].id){
					return $scope.data.champions[i].key;
				}
			};
		}

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

        var w = angular.element($window);

		w.bind('resize', function () {
			$scope.setConfigHeight();
		});
	}
]);
