'use strict';

angular.module('builds').directive('runesSection', ['Repository','$timeout',
	function(Repository,$timeout) {
		return {
			templateUrl: 	'modules/builds/views/runes-section.client.view.html',
			restrict: 		'E',
			controller: function() {

			}
		};
	}
]);