'use strict';

//Items service used to communicate Items REST endpoints
angular.module('items').factory('Items', ['$resource',
	function($resource) {
		return { 
			data: $resource('items/:patchId', { patchId: '@_id' }, 
			{
				update: {
					method: 'PUT'
				}
			})
		};
	}
]);