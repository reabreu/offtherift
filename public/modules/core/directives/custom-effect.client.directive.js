'use strict';

angular.module('core').directive('customEffect', ['Repository','$timeout',
	function(Repository,$timeout) {
		return {
			templateUrl: 	'modules/core/views/custom-effect.client.view.html',
			restrict: 		'E',
			scope: { 
				target: '=',
				copy: 	'=',
				load: 	'&'
			},
			controller: function($scope, $element){
				$scope.patches 		= [];
				$scope.patches 		= Repository.getCachedPatches();

				$scope.newEffect 	= function( target ){
					target.customEffect.push({
						stat 	: "ArmorPenetration",
						value 	: '',
						type 	: 'Flat',
						unique 	: false
					});
				}
				$scope.removeEffect = function ( target, index ){
					target.customEffect.splice(index);
				} 
		    }
		};
	}
]);