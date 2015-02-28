'use strict';

//Builds service used to communicate Builds REST endpoints
angular.module('builds').factory('Builds', ['$resource',
	function($resource) {
		return $resource('builds/:buildId', { buildId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);