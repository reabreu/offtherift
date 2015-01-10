'use strict';

angular.module('patch').filter('stateActionFilter', [
	function() {
		return function(input) {
			if(input){
				return 'Deactivate';
			}else{
				return 'Activate';
			}
		};
	}
]);