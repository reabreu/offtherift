'use strict';

angular.module('builds').filter('masterieDescription', [
	function() {
		return function(masterie) {
			return '<h3>' + masterie.name + '</h3>' + masterie.sanitizedDescription.toString().replace(/,/g,",<br/>");
		};
	}
]);