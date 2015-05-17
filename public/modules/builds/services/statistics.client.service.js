'use strict';

angular.module('builds').factory('Statistics', [ '$resource',
	function($resource) {
		return $resource('builds/statistics');
	}
]);