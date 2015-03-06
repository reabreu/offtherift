'use strict';

angular.module('builds').filter('buildItems', [
	function() {
		return function(input, search) {
            var newArray = [];

            for (var r = 0; r < input.length; r++) {

                if( search.name !== undefined && search.name != '' && input[r].name.indexOf(search.name) > -1 ){
                    newArray.push(input[r]);
                } else {
                    newArray.push(input[r]);
                }
            }

            return newArray;
		};
	}
]);