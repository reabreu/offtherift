'use strict';

angular.module('builds').directive('itemSection', [ 'ngToast','$state', 'Repository',
	function( ngToast, $state, Repository ) {
		return {
			templateUrl: 'modules/builds/views/item-section.client.view.html',
			restrict: 'E',
			scope: {
				data: 	'=',
				version: '=',
				build: 	'=',
				children: '=',
				loading: '=',
				query: '=?',
				full: '='
			},
			controller: function($scope){
				/**
				 * Default queries
				 * @type {Object}
				 */
				var defaultQuery = {
					limit: 30,
					version: $scope.version,
					name: "",
					tags: []
				};

				$scope.query = typeof $scope.query !== "undefined" ?
					angular.extend({}, $scope.query, defaultQuery) : defaultQuery;

				$scope.$watch('version', function(newValue, oldValue) {
					$scope.query.version = newValue;
					$scope.resetItems();
				});

				$scope.init = function(){
					$scope.buildMode = $state.current.name;

					if( $scope.buildMode != "viewBuild"){
						$scope.children.items = $scope;
						$scope.resetItems();
					}
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
						return item.requiredChampion == $scope.data.selectedChampion.name;
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
					var idx = $scope.query.tags.indexOf(tag);

					// is currently selected
					if (idx > -1) {
						$scope.query.tags.splice(idx, 1);
					} else {
						$scope.query.tags.push(tag);
					}
				};

				$scope.itemFilterEnabled = function(tag) {
					return ($scope.query.tags.indexOf(tag) > -1);
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

				$scope.removeChampionItems = function() {
					var changed; // check if any item was removed
					for (var snapshot = $scope.build.snapshot.length - 1; snapshot >= 0; snapshot--) {
						changed = false;
						// Remove all items related to the previous champion.
						var items = $scope.build.snapshot[snapshot].items;
						for (var i = $scope.build.snapshot[snapshot].championItems.length - 1; i >= 0; i--) {
							for (var c = items.length-1; c >= 0; c--) {
								if (items[c].id === $scope.build.snapshot[snapshot].championItems[i]) {
									items.splice(c, 1);
									changed = true;
								}
							}
							$scope.build.snapshot[snapshot].championItems.splice(i, 1);
						}

						if (changed) $scope.$parent.calculate(snapshot, true);
					}
				}

				/**
				 * Set current build level
				 */
				$scope.setLevel = function (level) {
					if( $scope.buildMode == "viewBuild") return;

					$scope.build.snapshot[$scope.data.currentSnapshot].level = level;
				}

				/**
				 * Get Items from Database
				 * @param  {object}  query Mongo query object
				 * @return {boolean}
				 */
				$scope.getItems = function (query) {
					Repository.getItems(query).then(function (data) {
						if (typeof $scope.data.items !== "undefined" &&
							$scope.data.items == 0) {
							$scope.data.items = data.items;
						} else {
							for (var i = 0; i < data.items.length; i++) {
								$scope.data.items.push(data.items[i]);
							}
						}
					});
				};

				/**
				 * Loads more items using skip
				 * @param  {integer} skip Offset
				 * @return {boolean}        Result
				 */
				$scope.loadMoreItems = function (skip) {
					if ($scope.loading || $scope.full) return;

					var loadQuery = angular.extend({}, $scope.query, {
						skip: skip
					});

					$scope.getItems(loadQuery);
				};

				$scope.searchItems = function () {
					$scope.data.items = [];
					$scope.full = false;

					$scope.loadMoreItems(0);
				};

				$scope.checkLevelSelection = function() {
					if ($scope.buildMode != "viewBuild")
						return true;
					return false;
				}

				/**
				 * Reset items
				 */
				$scope.resetItems = function() {
					$scope.data.items = [];
					$scope.full = false;
					// get first items
					$scope.getItems($scope.query);
				};

				$scope.$parent.setConfigHeight();
			}
		};
	}
]);
