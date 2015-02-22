'use strict';

//Champions service used to communicate Champions REST endpoints
angular.module('champions').factory('Champions', ['$resource',
	function($resource) {

		return {
			data: $resource('/champions/:championId', { championId: '@_id'},
				{
					update: {
						method: 'PUT'
					}
				}
			)
		};
	}
]);