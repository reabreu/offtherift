'use strict';

angular.module('patch').filter('synchedActionFilter', [
	function() {
		return function(input) {
			if(input){
				return 'Re-synch';
			}else{
				return 'Synch';
			}
		};
	}
]);