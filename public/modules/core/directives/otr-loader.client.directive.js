'use strict';

angular.module('core').directive('otrLoader', [
	function() {
		return {
			template: '<div id="otr-loader"><div class="outer"></div><div class="inner"></div></div>',
			restrict: 'E'
		};
	}
]);