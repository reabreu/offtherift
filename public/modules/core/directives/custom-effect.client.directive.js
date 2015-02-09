'use strict';

angular.module('core').directive('customEffect', [
	function() {
		return {
			templateUrl: 	'modules/core/views/custom-effect.client.view.html',
			restrict: 		'E',
			scope: { 
				target: 	'='
			},
			controller: function($scope, $element){
				$scope.newEffect = function( target ){
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