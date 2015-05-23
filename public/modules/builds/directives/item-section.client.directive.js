'use strict';

angular.module('builds').directive('itemSection', [ 'ngToast','$state',
	function( ngToast, $state ) {
		return {
			templateUrl: 'modules/builds/views/item-section.client.view.html',
			restrict: 'E',
			scope: {
				data: 	'=',
				build: 	'=',
				children: '='
			},
			controller: function($scope){

				$scope.init = function(){
					$scope.buildMode = $state.current.name;

					if( $scope.buildMode != "viewBuild")
						$scope.children.items = $scope;
				};

				$scope.search = {
					name: null
				};

				$scope.itemSearch = {
					name: "",
					tags: []
				};

				$scope.addItem = function(item, snapshot){

					if( $scope.buildMode == "viewBuild") return;

					if (typeof(snapshot) === 'undefined') snapshot = $scope.data.currentSnapshot;

					if (typeof($scope.build.snapshot[snapshot]['goldPer']) === 'undefined') {
						$scope.build.snapshot[snapshot].goldPer = {id: 0, isSet: false};
					}

					if (typeof($scope.build.snapshot[snapshot]['championItems']) === 'undefined') {
						$scope.build.snapshot[snapshot].championItems = [];
					}

					// Check if there is a free slot for another item.
					if ($scope.build.snapshot[snapshot].items.length < 6 || item.tags.indexOf('Trinket') > -1) {
						var limits = {};

						limits.goldPer = $scope.checkGoldIncome(item, snapshot);
						limits.requiredChampion = $scope.checkRequiredChampion(item, snapshot);

                        // Error messages.
						if (limits.goldPer === false) {
							ngToast.create({
								content: "Only one gold item allowed!"
							});
							return;
						}

						if (limits.requiredChampion === false) {
							ngToast.create({
								content: "That item can't be used on the selected champion!"
							});
							return;
						}

                        // Set control variables.
                        if (limits.goldPer) {
                            $scope.build.snapshot[snapshot].goldPer.id = item.id;
                            $scope.build.snapshot[snapshot].goldPer.isSet = true;
                        }

						if (limits.requiredChampion) {
							$scope.build.snapshot[snapshot].championItems.push(item.id);
						}

                        // Add item to the correct slot
						if (typeof(item.tags) !== 'undefined' && item.tags.indexOf('Trinket') > -1) {
                            // Adding another trinket will replace the previous one.
                            $scope.build.snapshot[snapshot].trinket = {
								id: item.id,
								customEffect: item.customEffect,
								name: item.name
							}
						} else {
							$scope.build.snapshot[snapshot].items.push({
								id: item.id,
								customEffect: item.customEffect,
								name: item.name
							});
						}
					}
				};

				$scope.checkGoldIncome = function(item, snapshot) {
					if (typeof(item.tags) !== 'undefined' && item.tags.indexOf('GoldPer') > -1) {
						return !$scope.build.snapshot[snapshot].goldPer.isSet;
					}
					return null;
				};

				$scope.checkRequiredChampion = function(item, snapshot) {
					if ('requiredChampion' in item) {
						return item.requiredChampion == $scope.build.snapshot[snapshot].selectedChampion.name;
					}
				};

				$scope.removeItem = function(index, snapshot){

					if( $scope.buildMode == "viewBuild") return;

					if (typeof(snapshot) === 'undefined') snapshot = $scope.data.currentSnapshot;

					var id;

                    if (index > 6) {
                        if ($scope.build.snapshot[snapshot].trinket == null) return;
                        id = $scope.build.snapshot[snapshot].trinket.id;
                        $scope.build.snapshot[snapshot].trinket = null;
                    } else {
                        id = $scope.build.snapshot[snapshot].items[index].id;
                        $scope.build.snapshot[snapshot].items.splice(index,1);
                    }

					// If this item is the one that set goldPer, unset goldPer.
					if ($scope.build.snapshot[snapshot].goldPer.isSet && $scope.build.snapshot[snapshot].goldPer.id == id) {
						$scope.build.snapshot[snapshot].goldPer.isSet = false;
					}

					// If this is a champion item, remove it from championItems
					var itemIndex = $scope.build.snapshot[snapshot].championItems.indexOf(id);
					if (itemIndex > -1) {
						$scope.build.snapshot[snapshot].championItems.splice(itemIndex, 1);
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
						for (var i = $scope.build.snapshot[snapshot].championItems.length - 1; i >= 0; i--) {
							for (var c = items.length-1; c >= 0; c--) {
								if (items[c].id === $scope.build.snapshot[snapshot].championItems[i]) {
									items.splice(c, 1);
								}
							}
							$scope.build.snapshot[snapshot].championItems.splice(i, 1);
						}
					}
				});

				/**
				 * Set current build level
				 */
				$scope.setLevel = function (level) {
					if( $scope.buildMode == "viewBuild") return;

					$scope.build.snapshot[$scope.data.currentSnapshot].level = level;
				}

				$scope.$parent.setConfigHeight();
			}
		};
	}
]);
