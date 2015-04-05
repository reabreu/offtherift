'use strict';

angular.module('builds').filter('regenStat', [
	function() {
		return function(input) {
			if(input === null || input === undefined) return 'n/a';

            return input[0] + ' | (' + input[1] + ')';
		};
	}
]);