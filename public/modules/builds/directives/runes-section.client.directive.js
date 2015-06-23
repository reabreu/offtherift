'use strict';

angular.module('builds').directive('runesSection', ['Repository', '$timeout', '$state', 'Runes', '$q',
	function(Repository, $timeout, $state, Runes, $q) {
		return {
			templateUrl: 	'modules/builds/views/runes-section.client.view.html',
			restrict: 		'E',
			scope: {
				data: '=',
				build: '=',
				children: '=',
				query: '=?',
				state: '=',
				version: '='
			},
			controller: function($scope) {
				// default select type
				$scope.currentType = 'mark';

				// set build mode
				$scope.buildMode = $state.current.name;

				/**
				 * Default queries
				 * @type {Object}
				 */
				var defaultQuery = {
					limit: 30,
					version: $scope.version
				};

				$scope.query = typeof $scope.query !== "undefined" ?
					angular.extend({}, $scope.query, defaultQuery) : defaultQuery;

				// change version callback
				$scope.$watch('version', function(newValue, oldValue) {
					if (newValue !== oldValue) {
						$scope.query.version = newValue;
						$scope.resetRunes().then(function() {
							// update runes from build
							if (typeof $scope.build.runes !== "undefined") {
								$scope.updateBuild();
							}
						});
					}
				});

				$scope.runeTypes = {
					'mark': 'Marks',
					'glyph': 'Glyphs',
					'seal': 'Seals',
					'quintessence': 'Quintessences'
				};

				$scope.runeSearch = {
					name: "",
					tags: []
				};

				$scope.runeLimits = {
					mark: 9,
					glyph: 9,
					seal: 9,
					quintessence: 3
				};

				/**
				 * Directive Initialization
				 */
				$scope.init = function () {
					// get first runes
					$scope.resetRunes();
				};

				/**
				 * Distribute rune to his tag
				 * @param  {object}  rune Rune Object
				 * @return {boolean} 	  Added
				 */
				$scope.distribute = function(rune) {
					if (typeof rune !== "undefined") {
						for (var tag in $scope.data.runes) {
							if (typeof rune.tags !== "undefined" &&
								rune.tags.indexOf(tag) != -1) {
								// Remove the old rune.
								$scope.removeRune(tag, rune.id);
								// Add the new one.
								$scope.addRune(rune);
								return true;
							}
						}
					}
					return false;
				};

				$scope.toggleRuneTag = function(tag) {
					var idx = $scope.runeSearch.tags.indexOf(tag);

					// is currently selected
					if (idx > -1) {
						$scope.runeSearch.tags.splice(idx, 1);
					} else {
						$scope.runeSearch.tags.push(tag);
					}
				};

				$scope.runeFilterEnabled = function(tag) {
					return ($scope.runeSearch.tags.indexOf(tag) > -1);
				};

				/**
				 * Appends the given rune to the build.
				 * @param Rune rune Rune to be appended to the build.
				 */
				$scope.addRune = function(rune) {
					if( $scope.buildMode == "viewBuild") return;

					var limiterTag = null;

					// Check rune limit by tag
					for (var i = rune.tags.length - 1; i >= 0; i--) {
						var tag = rune.tags[i];

						// if tag has limit and has been reached, can't add rune
						if (tag in $scope.runeLimits) {
							if ($scope.build.runes[tag].length < $scope.runeLimits[tag]) {
								if(!rune.customEffect.length) continue;

								$scope.build.runes[tag].push({'id' : rune.id, 'image' : rune.image.full, 'customEffect' : rune.customEffect, 'name': rune.name});

								if (rune.id in $scope.build.runes_aux.runeCount) {
									$scope.build.runes_aux.runeCount[rune.id]++;
								} else {
									$scope.build.runes_aux.runeCount[rune.id] = 1;
								}
							}
							break;
						}
					}
				};

				/**
				 * Removes the first rune found with the given id under the given tag.
				 * @param  string tag Rune Type
				 * @param  number id Rune ID
				 * @return {[type]}     [description]
				 */
				$scope.removeRune = function(tag, id) {
					if( $scope.buildMode == "viewBuild") return;

					for (var i = 0; i < $scope.build.runes[tag].length; i++) {
						if ($scope.build.runes[tag][i].id === id) {
							$scope.build.runes_aux.runeCount[id]--;
							$scope.build.runes[tag].splice(i, 1);
							break;
						}
					}
				};

				$scope.setCurrentType = function(tag) {
					$scope.currentType = tag;

					// initialize current type first runes
					if ($scope.data.runes[$scope.currentType].length == 0) {
						$scope.init();
					}
				};

				/**
				 * Get Runes from Database
				 * @param  {object}  query Mongo query object
				 * @param  {object}  type  Rune type
				 * @return {boolean}
				 */
				$scope.getRunes = function (query, type) {
					return Repository.getRunes(query, type).then(function (data) {

						if (typeof data.runes !== "undefined" &&
							data.runes.length == 0) {
							$scope.state[type].full = true;
						}

						if (typeof $scope.data.runes[type] !== "undefined" &&
							$scope.data.runes[type].length == 0) {
							$scope.data.runes[type] = data.runes;
						} else {
							for (var i = 0; i < data.runes.length; i++) {
								$scope.data.runes[type].push(data.runes[i]);
							}
						}
					});
				};

				/**
				 * Loads more items using skip
				 * @param  {integer} skip Offset
				 * @return {boolean}        Result
				 */
				$scope.loadMoreRunes = function (skip) {

					if ($scope.state[$scope.currentType].loading ||
						$scope.state[$scope.currentType].full) return;

					var loadQuery = angular.extend({}, $scope.query, {
						skip: skip
					});

					return $scope.getRunes(loadQuery, $scope.currentType);
				};

				/**
				 * Reset Runes
				 */
				$scope.resetRunes = function () {
					$scope.data.runes = {
						mark:         [],
						glyph:        [],
						seal:         [],
						quintessence: []
					};

					$scope.state.mark.full = false;
					$scope.state.glyph.full = false;
					$scope.state.seal.full = false;
					$scope.state.quintessence.full = false;

					return $scope.getRunes($scope.query, $scope.currentType);
				};

				/**
				 * Updates the runes from last selected patch to the new one.
				 * @return
				 */
				$scope.updateBuild = function() {
					return $scope.loadRunes().then(function (runes) {
						// Iterate through all the runes in the build to update them
						for (var i = 0; i < runes.length; i++) {
							$scope.distribute(runes[i]);
						}
					});
				};

				/**
				 * Returns runes by using id's
				 * @return {object} Rune
				 */
				$scope.loadRunes = function () {
					var deferred = $q.defer();

					var scopedRunes   = [];
					var unloadedRunes = [];

					// Iterate through all the runes in the build to update them.
					for (var tag in $scope.build.runes) {
						var runes = $scope.build.runes[tag];

						// Load runes from scope
						for (var i = 0; i < runes.length; i++) {
							var rune = $scope.getRuneFromScope(tag, runes[i].id);

							if (rune) {
								scopedRunes.push(rune);
							} else {
								unloadedRunes.push(runes[i].id);
							}
						}
					}

					// load runes from database
					if (unloadedRunes.length > 0) {
						$scope.getRunesFromDatabase(tag, unloadedRunes).then(function (data) {
							for (var i = 0; i < data.length; i++) {
								scopedRunes.push(data[i]);
							}

							deferred.resolve(scopedRunes);
						});
					} else {
						deferred.resolve(scopedRunes);
					}

					return deferred.promise;
				};

				/**
				 *
				 * Returns rune by id and tag from scope array
				 * @param  {string} tag    Rune tag
				 * @param  {int}    runeId Rune Identification
				 * @return {object}        Rune
				 */
				$scope.getRuneFromScope = function (tag, runeId) {
					// Find the rune and add it to the build.
					var dataRuneCount = $scope.data.runes[tag].length;
					for (var r = 0; r < dataRuneCount; r++) {
						if ($scope.data.runes[tag][r].id == runeId) {
							return $scope.data.runes[tag][r];
						}
					}
					return false;
				};

				/**
				 * Returns rune by id and tag from database
				 * @param  {string} tag   Rune tag
				 * @param  {int}    runes Rune Identifications
				 * @return {object}       Promise
				 */
				$scope.getRunesFromDatabase = function (tag, runes) {
					var params = {
						version: $scope.query.version,
						riotId: runes
					};

					// Get from database
					return Runes.data.query(params).$promise;
				};
			}
		};
	}
]);
