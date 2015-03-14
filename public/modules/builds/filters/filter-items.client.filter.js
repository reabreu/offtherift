'use strict';

angular.module('builds').filter('filterItems', [
	function() {
		return function(input, filters) {
			var newArray = [];

			for (var r = 0; r < input.length; r++) {
				var item = input[r];
				var accept = true;

				for (var i = 0; i < filters.tags.length; i++) {
					if (item.tags.indexOf(filters.tags[i]) === -1) {
						accept = false;
						break;
					}
				}

				if (!accept) {
					continue;
				}

				var terms = filters.name.toLowerCase().split(/[\s]+/);
				var itemName = item.name.toLowerCase();
				for (var i = 0; (i < terms.length) && accept; i++) {
					if (itemName.indexOf(terms[i]) == -1) {
						accept = false;
					}
				};

				if (accept) newArray.push(item);
			}

			return newArray;
		};
	}
]);