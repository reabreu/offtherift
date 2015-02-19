'use strict';

//Items service used to communicate Items REST endpoints
angular.module('items').factory('Items', ['$resource',
	function($resource) {
		return { 
			data: $resource('items/:itemID', { itemID: '@_id' }, 
				{
					update: {
						method: 'PUT'
					}
				}
			)
		};
	}
]);