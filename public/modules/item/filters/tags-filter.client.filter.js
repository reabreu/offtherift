'use strict';

angular.module('item').filter('tagsFilter', [
	function() {
		return function(input) {
			var text = "";

			if( input === undefined) return text;

			for (var i = 0; i < input.length; i++) {
				if(i == 0)
					text += input[i];
				else
					text += ", " + input[i];
			};

			return text;
		};
	}
]);