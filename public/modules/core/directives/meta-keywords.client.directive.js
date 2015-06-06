'use strict';

angular.module('core').directive('metaKeywords', [
	function() {
		return {
			template: '<meta name="keywords" content={{pageKeywords}}>',
			restrict: 'E',
			replace: true
		};
	}
]);