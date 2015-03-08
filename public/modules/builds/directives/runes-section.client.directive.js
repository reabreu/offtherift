'use strict';

angular.module('builds').directive('runesSection', ['Repository','$timeout',
	function(Repository,$timeout) {
		return {
			templateUrl: 	'modules/builds/views/runes-section.client.view.html',
			restrict: 		'E',
			scope: {
				data: '=',
				build: '='
			},
			controller: function($scope) {
				$scope.runeCount = {};

				$scope.currentType = 'mark';

				$scope.runeTypes = {
					'mark': 'Marks',
					'glyph': 'Glyphs',
					'seal': 'Seals',
					'quintessence': 'Quintessences'
				};

				$scope.runesByType = {
					mark: 			[],
					glyph: 			[],
					seal: 			[],
					quintessence: 	[]
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
				}

				$scope.build.runes['mark'] 			= [];
				$scope.build.runes['glyph'] 		= [];
				$scope.build.runes['seal'] 			= [];
				$scope.build.runes['quintessence'] 	= [];

				$scope.init = function() {
					var runesLength = $scope.data.runes.length;
					for (var i = 0; i < runesLength; i++) {
						if ($scope.data.runes[i].tags.indexOf('mark') > -1) {
							$scope.runesByType['mark'].push($scope.data.runes[i]);
						}
						else if ($scope.data.runes[i].tags.indexOf('glyph') > -1) {
							$scope.runesByType['glyph'].push($scope.data.runes[i]);
						}
						else if ($scope.data.runes[i].tags.indexOf('seal') > -1) {
							$scope.runesByType['seal'].push($scope.data.runes[i]);
						}
						else if ($scope.data.runes[i].tags.indexOf('quintessence') > -1) {
							$scope.runesByType['quintessence'].push($scope.data.runes[i]);
						}
					};
				}
				
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

				$scope.addRune = function(rune) {
					var limiterTag = null;

					// Check rune limit by tag
					for (var i = rune.tags.length - 1; i >= 0; i--) {
						var tag = rune.tags[i];
						
						// if tag has limit and has been reached, can't add rune
						if (tag in $scope.runeLimits) {
							if ($scope.build.runes[tag].length < $scope.runeLimits[tag]) {
								$scope.build.runes[tag].push({'id' : rune.id, 'image' : rune.image.full, 'customEffect' : rune.customEffect});
								
								if (rune.id in $scope.runeCount) {
									$scope.runeCount[rune.id]++;
								} else {
									$scope.runeCount[rune.id] = 1;
								}
							}
							break;
						}
					}
				};

				$scope.removeRune = function(tag, id) {
					for (var i = $scope.build.runes[tag].length - 1; i >= 0; i--) {
						if ($scope.build.runes[tag][i].id === id) {
							$scope.build.runes[tag].splice(i, 1);
							$scope.runeCount[id]--;
							break;
						}
					};
				};

				$scope.$watch('data.runes', function(newVal) {
					$scope.init();
				}, true);

				$scope.setCurrentType = function(tag) {
					$scope.currentType = tag;
				};
			}
		};
	}
]);