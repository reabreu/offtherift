'use strict';

angular.module('builds').directive('itemSection', [
	function() {
		return {
			templateUrl: 'modules/builds/views/item-section.client.view.html',
			restrict: 'E',
			scope: {
				data: 	'=',
				build: 	'='
			},
			controller: function($scope, $element){


				$scope.init = function(){
					if ($scope.build.snapshot.length == 0)
						$scope.addSnapshot();

					// Control var to check if GoldBase item has been set.
					$scope.data["GoldBase"] = {
						id: 0,
						isSet: false
					};
				};

				$scope.search = {
					name: null
				};

				$scope.itemSearch = {
					name: "",
					tags: []
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
						level: 	1,
						items:  [],
						name: 	''
					};

					$scope.build.snapshot.push(snapTmp);
					$scope.build.calculatedStats.push(statTmp);
					var length = $scope.build.snapshot.length-1;
					$scope.setCurrentSnap(length);
				};

				$scope.setCurrentSnap = function(index){
					$scope.data.currentSnapshot = index;
				};

				$scope.addItem = function(item){
					// Check if there is a free slot for another item.
					if ( $scope.build.snapshot[$scope.data.currentSnapshot].items.length < 6) {
						// Check if the item belongs to group GoldBase and is the first one being set.
						if (!item.group || item.group === "GoldBase" && !$scope.data["GoldBase"].isSet) {
							var name = "";
							for (var i = $scope.data.champions.length - 1; i >= 0; i--) {
								if ($scope.data.champions[i].id == $scope.build.champion_id) {
									name = $scope.data.champions[i].name;
									break;
								}
							}

							if (!item.requiredChampion || item.requiredChampion === name) {
								$scope.build.snapshot[$scope.data.currentSnapshot].items.push({id:item.id, customEffect: item.customEffect});
								$scope.data["GoldBase"].id = item.id;
								$scope.data["GoldBase"].isSet = true;
							} else {
								// TODO: Warn user about using items for the wrong champion.
								console.log("That item can't be used on the selected champion!");
							}
						} else {
							// TODO: Warn user about using multiple gold items.
							console.log("Only one gold item allowed!");
						}
					}
				};

				$scope.removeItem = function(index){
					var id = $scope.build.snapshot[$scope.data.currentSnapshot].items[index].id;

					$scope.build.snapshot[$scope.data.currentSnapshot].items.splice(index,1);
					
					// If this item is the one that set GoldBase, unset GoldBase.
					if ($scope.data["GoldBase"].isSet && $scope.data["GoldBase"].id == id) {
						$scope.data["GoldBase"].isSet = false;
					}
				};

				$scope.toggleItemTag = function(tag) {
					var idx = $scope.itemSearch.tags.indexOf(tag);

					// is currently selected
					if (idx > -1) {
						$scope.itemSearch.tags.splice(idx, 1);
					} else {
						$scope.itemSearch.tags.push(tag);
					}
				};

				$scope.itemFilterEnabled = function(tag) {
					return ($scope.itemSearch.tags.indexOf(tag) > -1);
				};

				$scope.range = function(min, max, step){
					step = step || 1;
					var input = [];
					for (var i = min; i <= max; i += step) input.push(i);
					return input;
				};

				$scope.filterFunction = function(element) {
					if ($scope.search.name === null) return true;
					return element.name.toLowerCase().indexOf($scope.search.name.toLowerCase()) > -1;
				}
		    }
		};
	}
]);
