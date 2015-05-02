'use strict';

angular.module('builds').filter('masterieDescription', [
	function() {
		return function(input) {
			return input.toString().replace(/,/g,",<br/>");
		};
	}
]);