'use strict';

angular.module('builds').factory('popularBuilds', [ '$resource',
	function($resource) {
		return $resource('builds/popular');
	}
]);