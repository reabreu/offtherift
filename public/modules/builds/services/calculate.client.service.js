'use strict';

angular.module('builds').factory('Calculate', ['$resource',
	function($resource) {
		return $resource('/calculate');
	}
]);