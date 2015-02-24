'use strict';

angular.module('core').filter('inArray', [
	function() {
        /**
         * Return true if value is in Array
         * @param  {string}  value Value
         * @param  {string}  array Array
         * @return {boolean}       In array
         */
		return function(value, array) {
            if (angular.isDefined(array)) {
                for (var i = array.length - 1; i >= 0; i--) {
                    if (array[i] == value) { return true };
                }
            }
            return false;
		};
	}
]);