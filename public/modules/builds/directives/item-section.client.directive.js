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
								// evokes calculate from BuildsController
								$scope.$parent.evaluateStatsRequest();
							});
						});
					}
				});

				$scope.init = function(){
					$scope.itemTree = [];
					$scope.buildMode = $state.current.name;

					if( $scope.buildMode != "viewBuild"){
						$scope.resetItems();
					}

					$scope.getItemTree(3078, '5.12.1'); // DEBUG
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
                        console.log('aquiii');
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
						// Iterate through the snapshots to update the items.
						for (var i =  0; i < $scope.build.snapshot.length; i++) {
							var snapshot = $scope.build.snapshot[i];

							// Remove all the current items and re-add them with updated information.
							for (var j = snapshot.items.length - 1; j >= 0; j--) {

								// Iterate through the items and update snapshots
								for (var h = 0; h < items.length; h++) {
									if (snapshot.items[0].id == items[h].id) {
										// Remove the information from the old item.
										$scope.removeItem(0, i);
										// Add information from the new item.
										$scope.addItem(items[h], i);

										break;
									}
								}
							}
						}
					});
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

				/**
				 * Loads the dependencies tree for the item with given id into $scope.itemTree
				 * @param  int		itemId  Id of the root item of the tree.
				 * @param  string	version Version from where we should get the information.
				 * @return
				 */
				$scope.getItemTree = function(itemId, version) {
					$scope.itemTree = []; // start with a clean tree
					var newRoot = {id : 1};

					// TODO: Refactor to get only the necessary items...
					Repository.getItems({ 'version' : version }).then(function(data) {
						// Get the information of the root item.
						for (var i = data.items.length - 1; i >= 0; i--) {
							if (data.items[i].id == itemId) {
								// Insert the root node into the tree.
								newRoot.item = data.items[i];
								newRoot.dependencies = getDependencies(data.items[i], data.items, 10);
								break;
							}
						};
						$scope.itemTree.push(newRoot);
						console.log($scope.itemTree);
					});
				};

				/**
				 * Get a list of nodes of the items that build into given item.
				 * WARNING: PREPARE FOR RECURSIVE BONANZA! xD
				 * @param  {[type]} itemId [description]
				 * @param  {[type]} items  [description]
				 * @return [node] Nodes with the information of the base items.
				 */
				var getDependencies = function(item, itemList, level) {
					// Indexes of the items that should be added to the tree.
					var search = (typeof item.from === 'undefined') ? [] : item.from;
					var result = [];

					// Dig Deeper
					for (var i = search.length - 1; i >= 0; i--) {
						var nextNode = {id : level + i + 1};

						// Get the item information for search[i].
						for (var j = itemList.length - 1; j >= 0; j--) {
							if (itemList[j].id == search[i]) {
								nextNode.item = itemList[j];
								break;
							}
						};

						nextNode.Dependencies = getDependencies(nextNode.item, itemList, nextNode.id*10);
						
						result.push(nextNode);
					}

					return result;
				};

				$scope.$parent.setConfigHeight();
			}
		};
	}
]).requires.push('ui.tree');
