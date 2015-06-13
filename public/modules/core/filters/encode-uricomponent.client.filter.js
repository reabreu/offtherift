'use strict';

angular.module('core').filter('encodeUricomponent', [
	function() {
		return function(input) {
			// Encode uricomponent directive logic
			// ...
            return input.toLowerCase()
                        .replace(/^-+|-+$/g, '')
                        .replace(/[^a-zA-Z0-9]+/g, '-')
                        .trim();
		};
	}
]);