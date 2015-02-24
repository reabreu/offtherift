'use strict';

//Masteries service used to communicate Masteries REST endpoints
angular.module('masteries').factory('Masteries', ['$resource',
	function($resource) {
        return {
            data: $resource('/masteries/:masterieId', { masterieId: '@_id'},
                {
                    update: {
                        method: 'PUT'
                    }
                }
            )
        };
	}
]);