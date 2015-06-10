'use strict';

angular.module('core').filter('encodeUricomponent', [
	function() {
		return function(input) {
			// Encode uricomponent directive logic
			// ...
            return encodeURIComponent(input);
		};
	}
]);