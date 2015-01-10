'use strict';

angular.module('patches').filter('boolFilter', [
	function() {
		return function(state) {
			// Synched filter directive logic
			if(state){
				return 'Yes';
			}else{
				return 'No';
			}
		};
	}
]);