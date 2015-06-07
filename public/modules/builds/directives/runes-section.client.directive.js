'use strict';

angular.module('builds').directive('runesSection', ['Repository','$timeout','$state',
	function(Repository,$timeout,$state) {
		return {
			templateUrl: 	'modules/builds/views/runes-section.client.view.html',
			restrict: 		'E',
			scope: {
				data: '=',
				build: '=',
				children: '=',
				loading: '=',
				query: '=',
				full: '=',
				version: '='
			},
			controller: function($scope) {
				// default select type
				$scope.currentType = 'mark';

				/**
				 * Default queries
				 * @type {Object}
				 */
				var defaultQuery = {
					limit: 30,
					version: $scope.version,
					type: $scope.currentType
				};

				var query = typeof $scope.query !== "undefined" ?
					angular.extend({}, $scope.query, defaultQuery) : defaultQuery;

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

				$scope.runesByType = {
					mark: 			[],
					glyph: 			[],
					seal: 			[],
					quintessence: 	[]
				};

				$scope.runesFull = {
					mark: 			false,
					glyph: 			false,
					seal: 			false,
					quintessence: 	false
				};

				/**
				 * Directive Initialization
				 */
				$scope.init = function () {
					// get first runes
					query.skip = $scope.runesByType[$scope.currentType].length;
					$scope.getRunes(query, $scope.currentType);
				};

				$scope.distribute = function() {

					$scope.buildMode = $state.current.name;

					if( $scope.buildMode == "viewBuild") return;

					$scope.children.runes = $scope;
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

				$scope.$watch('data.runes', function(newVal) {
					$scope.distribute();
				}, true);

				$scope.setCurrentType = function(tag) {
					$scope.currentType = tag;

					// initialize current type first runes
					if ($scope.runesByType[$scope.currentType].length == 0) {
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
					var loadQuery = angular.extend(query, {
						type: type
					});
					Repository.getRunes(query).then(function (data) {

						if (typeof data.runes !== "undefined" &&
							data.runes.length == 0) {
							$scope.runesFull[query.type] = true;
						}

						if (typeof $scope.runesByType[type] !== "undefined" &&
							$scope.runesByType[type].length == 0) {
							$scope.runesByType[type] = data.runes;
						} else {
							for (var i = 0; i < data.runes.length; i++) {
								$scope.runesByType[type].push(data.runes[i]);
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

					if ($scope.loading || $scope.runesFull[$scope.currentType]) return;

					var loadQuery = angular.extend(query, {
						skip: skip
					});

					$scope.getRunes(loadQuery, $scope.currentType);
				};
			}
		};
	}
]);
