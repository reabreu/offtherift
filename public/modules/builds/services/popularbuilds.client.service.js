'use strict';

angular.module('builds').factory('popularBuilds', [ '$resource',
    function($resource) {
        return {
            mostPopular:    $resource('builds/mostPopular'),
            mostCommented:  $resource('builds/mostCommented'),
            mostShared:     $resource('builds/mostShared'),
            mostLiked:      $resource('builds/mostLiked')
        };
    }
]);