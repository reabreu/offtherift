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
			controller: function($scope){

				$scope.init = function(){
					if ($scope.build.snapshot.length == 0)
						$scope.addSnapshot();

					// Control var to check if goldPer item has been set.
					$scope.data.goldPer = {
						id: 0,
						isSet: false
					};

					// ID's of items that require the current champion.
					// Must be updated if the champion changes.
					$scope.data.championItems = [];
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

				$scope.setCurrentSnap = function(index){
					$scope.data.currentSnapshot = index;
				};

				$scope.addItem = function(item){
					// Check if there is a free slot for another item.
					if ($scope.build.snapshot[$scope.data.currentSnapshot].items.length < 6 || item.tags.indexOf('Trinket') > -1) {
						var limits = {};

						limits.goldPer = $scope.checkGoldIncome(item);
						limits.requiredChampion = $scope.checkRequiredChampion(item);

                        // Error messages.
						if (limits.goldPer === false) {
							// TODO: Warn user about using multiple gold items.
							console.log("Only one gold item allowed!");
							return;
						}

						if (limits.requiredChampion === false) {
							// TODO: Warn user about using items for the wrong champion.
							console.log("That item can't be used on the selected champion!");
							return;
						}

                        // Set control variables.
                        if (limits.goldPer) {
                            $scope.data.goldPer.id = item.id;
                            $scope.data.goldPer.isSet = true;
                        }

						if (limits.requiredChampion) {
							$scope.data.championItems.push(item.id);
						}

                        // Add item to the correct slot
						if (item.tags.indexOf('Trinket') > -1) {
                            // Adding another trinket will replace the previous one.
                            $scope.build.snapshot[$scope.data.currentSnapshot].trinket = {
								id: item.id,
								customEffect: item.customEffect
							}
						} else {
							$scope.build.snapshot[$scope.data.currentSnapshot].items.push({
								id: item.id,
								customEffect: item.customEffect
							});
						}
					}
				};

				$scope.checkGoldIncome = function(item) {
					if (item.tags.indexOf('GoldPer') > -1) {
						return !$scope.data.goldPer.isSet;
					}
					return null;
				};

				$scope.checkRequiredChampion = function(item) {
					if ('requiredChampion' in item) {
						return item.requiredChampion == $scope.data.selectedChampion.name;
					}
				};

				$scope.removeItem = function(index){
					var id;

                    if (index > 6) {
                        if ($scope.build.snapshot[$scope.data.currentSnapshot].trinket == null) return;
                        id = $scope.build.snapshot[$scope.data.currentSnapshot].trinket.id;
                        $scope.build.snapshot[$scope.data.currentSnapshot].trinket = null;
                    } else {
                        id = $scope.build.snapshot[$scope.data.currentSnapshot].items[index].id;
                        $scope.build.snapshot[$scope.data.currentSnapshot].items.splice(index,1);
                    }

					// If this item is the one that set goldPer, unset goldPer.
					if ($scope.data.goldPer.isSet && $scope.data.goldPer.id == id) {
						$scope.data.goldPer.isSet = false;
					}

					// If this is a champion item, remove it from championItems
					var itemIndex = $scope.data.championItems.indexOf(id);
					if (itemIndex > -1) {
						$scope.data.championItems.splice(itemIndex, 1);
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
				};

				/**
				 * Listen for any champion change and update the items when necessary.
				 */
				$scope.$watch('data.selectedChampion', function(newValue, oldValue) {
					// newValue/oldValue: champion data object

					// Remove all items related to the previous champion.
					if (oldValue != null && newValue != null && newValue.id != oldValue.id) {
						var items = $scope.build.snapshot[$scope.data.currentSnapshot].items;
						for (var i = $scope.data.championItems.length - 1; i >= 0; i--) {
							for (var c = items.length-1; c >= 0; c--) {
								if (items[c].id === $scope.data.championItems[i]) {
									items.splice(c, 1);
								}
							}
							$scope.data.championItems.splice(i, 1);
						}
					}
				});

				/**
				 * Set current build level
				 */
				$scope.setLevel = function (level) {
					$scope.build.snapshot[$scope.data.currentSnapshot].level = level;
				}
			}
		};
	}
]);
