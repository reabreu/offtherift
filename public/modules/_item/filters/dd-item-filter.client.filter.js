'use strict';

angular.module('item').filter('ddItemFilter', [
	function() {
		return function(input) {
			// Dd item filter directive logic
			return 'http://ddragon.leagueoflegends.com/cdn/4.20.1/img/item/' + input;
		};
	}
]);