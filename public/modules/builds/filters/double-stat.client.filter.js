'use strict';

angular.module('builds').filter('doubleStat', [
	function() {
		return function(input) {
			// Double stat directive logic
			// ...

			return input[0] + ' | ' + input[1] + ' %';
		};
	}
]);