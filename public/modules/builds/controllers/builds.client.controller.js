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

			$scope.runeSearch = {
				name : "",
				tags : ['magic',
						'flat'
				]
			};

			//objeto build que sera vazio no caso de estarmos a criar uma nova build
			$scope.build = {
				visible: 		false,
				name: 			null,
				champion_id: 	null,
				version: 		null,
				snapshot: 		[
					{
						level:  1,
						name: 	'',
						items:  [],
						calculatedStats 	: {
							hp: 'n/a',
							mp: 'n/a',
							hpregen: 'n/a',
							mpregen: 'n/a',
							attackdamage: 'n/a',
							abilitypower: 'n/a',
							armorpenetration: 'n/a',
							magicpenetration: 'n/a',
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
						}
					}
				]
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
		 * [getPatchInfo Load patch information needed for build]
		 * @return {[type]}
		 */
		$scope.getPatchInfo = function(){
			Repository.setSelectedPatch($scope.data.selectedPatch);

			var params = {version: $scope.data.selectedPatch, build: true };

			Repository.getChampions(params).then(function(data) {
				$scope.data.champions 			= data.champions;
				$scope.data.selectedChampion 	= data.champions[parseInt(Math.random() * ($scope.data.champions.length))];
			});
			Repository.getItems(params).then(function(data) {
				$scope.data.items 		= data.items;
			});
			Repository.getRunes(params).then(function(data) {
				$scope.data.runes 		= data.runes;
			});
			Repository.getMasteries(params).then(function(data) {
				$scope.data.masteries 	= data.masteries;
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
		};

		/**
		 * [calculate Calculate the stats of current build]
		 * @return {[type]}
		 */
		$scope.calculate = function(){

			if($scope.build.snapshot[$scope.data.currentSnapshot].level === null || $scope.data.selectedChampion === null) return;

			var request = {
				level: $scope.build.snapshot[$scope.data.currentSnapshot].level,
				stats: $scope.data.selectedChampion.stats,
				effects: []
			};

			ngProgress.start();
			Calculate.save(request).$promise.then(function(data) {
				$scope.build.snapshot[$scope.data.currentSnapshot].calculatedStats = data;
				ngProgress.complete();
			});
		};

		$scope.toggleRuneTag = function(tag) {
			var idx = $scope.runeSearch.tags.indexOf(tag);

			// is currently selected
			if (idx > -1) {
				$scope.runeSearch.tags.splice(idx, 1);
			} else {
				$scope.runeSearch.tags.push(tag);
			}

			console.log($scope.runeSearch);
		};

		$scope.runeFilterEnabled = function(tag) {
			return ($scope.runeSearch.tags.indexOf(tag) > -1);
		};

		//timeout para calcular novos stats
		$scope.$watchGroup(['data.level','data.selectedChampion'], function(newValues, oldValues, scope) {
			if ($scope.data.timer !== null){
				$timeout.cancel($scope.data.timer);
			}
			$scope.data.timer = $timeout($scope.calculate,1000);
		});
	}
]);

angular.module('builds').filter('filterRunes', function() {
	return function(input, filters) {
		var newArray = [];

		for (var r = 0; r < input.length; r++) {
			var rune = input[r];
			var accept = true;

			for (var i = 0; i < filters.tags.length; i++) {
				if (rune.tags.indexOf(filters.tags[i]) === -1) {
					accept = false;
					break;
				}
			}

			if(accept && (rune.name.indexOf(filters.name) > -1)) {
				newArray.push(rune);
			}

			//console.log(filters);
		}

		return newArray;
	};
});
