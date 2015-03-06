'use strict';

angular.module('builds').directive('runesSection', ['Repository','$timeout',
	function(Repository,$timeout) {
		return {
			templateUrl: 	'modules/builds/views/runes-section.client.view.html',
			restrict: 		'E',
			controller: function($scope) {
				$scope.toggleRuneTag = function(tag, runeSearch) {
					var idx = runeSearch.tags.indexOf(tag);

					// is currently selected
					if (idx > -1) {
						runeSearch.tags.splice(idx, 1);
					} else {
						runeSearch.tags.push(tag);
					}
				};

				$scope.runeFilterEnabled = function(tag, runeSearch) {
					return (runeSearch.tags.indexOf(tag) > -1);
				};
			}
		};
	}
]);