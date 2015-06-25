'use strict';

angular.module('builds').directive('itemSection', [ 'ngToast','$state', 'Repository', 'Items', '$q',
	function(ngToast, $state, Repository, Items, $q) {
		return {
			templateUrl: 'modules/builds/views/item-section.client.view.html',
			restrict: 'E',
			scope: {
				data: 	'=',
				version: '=',
				build: 	'=',
				loading: '=?',
				query: '=?',
				full: '=?'
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

				/**
				 * Updates all the snapshots from last selected patch to the new one.
				 * @return
				 */
				$scope.updateSnapshots = function() {
					// TODO: Update trinket on patch change

					return true;

					// Update the trinket
					if (currentSnap.trinket != null) {
						// Search for the item and add it if it exists.
						var itemCount = $scope.data.items.length;
						for (var itemIter = 0; itemIter < itemCount; itemIter++) {
							if ($scope.data.items[itemIter].id == currentSnap.trinket.id) {
								// Remove the information from the old item.
								$scope.removeItem(7);
								// Add information from the new item.
								$scope.addItem($scope.data.items[itemIter], snapIter);
								break;
							}
						}
					}
				};

				$scope.query = typeof $scope.query !== "undefined" ?
					angular.extend({}, $scope.query, defaultQuery) : defaultQuery;

				// change version callback
				$scope.$watch('version', function(newValue, oldValue) {
					if (newValue !== oldValue) {
						$scope.query.version = newValue;
						$scope.resetItems().then(function () {
							// update items from build snapshots
							$scope.updateBuildSnapshots().then(function () {
								// update snapshot's items
								$scope.updateSnapshots();
								// evoques calculate from BuildsController
								$scope.$parent.evaluateStatsRequest();
							});
						});
					}
				});

				$scope.init = function(){
					$scope.buildMode = $state.current.name;

					if( $scope.buildMode != "viewBuild"){
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
					return Repository.getItems(query).then(function (data) {
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
					return $scope.getItems($scope.query);
				};

				/**
				 * Updates the runes from last selected patch to the new one.
				 * @return
				 */
				$scope.updateBuildSnapshots = function() {
					return loadItems().then(function (items) {
						// Iterate through the items and update snapshots
						for (var i = 0; i < items.length; i++) {
							distribute(items[i]);
						}
					});
				};

				/**
				 * Distribute item to his tag
				 * @param  {object}  item Item Object
				 * @return {boolean} 	  Added
				 */
				var distribute = function(item) {
					if (typeof item !== "undefined") {
						// Iterate through the snapshots to update the items.
						for (var i =  0; i < $scope.build.snapshot.length; i++) {
							var snapshot = $scope.build.snapshot[i];

							// Remove all the current items and re-add them with updated information.
							for (var j = 0; j < snapshot.items.length; j++) {
								if (snapshot.items[j].id == item.id) {
									// Remove the information from the old item.
									$scope.removeItem(j, i);
									// Add information from the new item.
									$scope.addItem(item, i);

									break;
								}
							}
						}
					}
					return true;
				};

				/**
				 * Returns items by using id's
				 * @return {object} Item
				 */
				var loadItems = function () {
					var deferred = $q.defer();

					var scopedItems   = [];
					var unloadedItems = [];

					// Iterate through the snapshots to update the items.
					for (var i =  0; i < $scope.build.snapshot.length; i++) {
						var snapshot = $scope.build.snapshot[i];

						// Remove all the current items and re-add them with updated information.
						for (var j = snapshot.items.length - 1; j >= 0 ; j--) {
							var item = getItemFromScope(snapshot.items[j].id);

							if (item) {
								scopedItems.push(item);
							} else {
								unloadedItems.push(snapshot.items[j].id);
							}
						}
					}

					// load items from database
					if (unloadedItems.length > 0) {
						getItemsFromDatabase(unloadedItems).then(function (data) {
							for (var i = 0; i < data.length; i++) {
								scopedItems.push(data[i]);
							}

							deferred.resolve(scopedItems);
						});
					} else {
						deferred.resolve(scopedItems);
					}

					return deferred.promise;
				};

				/**
				 *
				 * Returns item by id
				 * @param  {int}    itemId Item Identification
				 * @return {object}        Item
				 */
				var getItemFromScope = function (itemId) {
					// Find the item and add it to the build.
					for (var r = 0; r < $scope.data.items.length; r++) {
						if ($scope.data.items[r].id == itemId) {
							return $scope.data.items[r];
						}
					}
					return false;
				};

				/**
				 * Returns item by id
				 * @param  {int}    items Item Identifications
				 * @return {object}       Promise
				 */
				var getItemsFromDatabase = function (items) {
					var params = {
						version: $scope.query.version,
						riotId: items
					};

					// Get from database
					return Items.data.query(params).$promise;
				};

				$scope.$parent.setConfigHeight();
			}
		};
	}
]);
