'use strict';

angular.module('builds').filter('doubleStat', [
	function() {
		return function(input) {
			// Double stat directive logic
			// ...
            if(input === null || input === undefined) return 'n/a';

			return input[0] + '|' + input[1] + '%';
		};
	}
]);