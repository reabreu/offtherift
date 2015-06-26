'use strict';

angular.module('users').factory('Userstatistics', ['$resource',
	function($resource) {
		// Public API
		return {
			count: $resource('/users/count'),
            unSetHash: $resource('/hashes/unSet')
		};
	}
]);