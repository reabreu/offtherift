'use strict';

//Runes service used to communicate Runes REST endpoints
angular.module('runes').factory('Runes', ['$resource',
	function($resource) {
		return {
			data: 			$resource('/runes/:runeId', { runeId: '@_id'},
			{
				update: {
					method: 'PUT'
				}
			})
		};
	}
]);