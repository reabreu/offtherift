'use strict';

// Hashes service used for communicating with the users REST endpoint
angular.module('users').factory('Hashes', ['$resource', '$http',
    function($resource, $http) {
        return {
            /**
             * Hashes Get Server Data
             * @type {object}
             */
            data: $resource('/hashes', {}, {
                update: {
                    method: 'PUT'
                }
            }),
            /**
             * Get hash data from server
             * @type {object}
             */
            one: $resource('/hash'),
            /**
             * Subscribe email
             * @type {object}
             */
            subscribe: $resource('/subscribe/:email', { email: '@email' }),
            /**
             * Generate Hashes
             * @type {object}
             */
            generate: $resource('/hashes/:input:id', { input: '@input', id: '@id' }),
        };
    }
]);