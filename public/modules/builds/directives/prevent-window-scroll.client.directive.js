'use strict';

angular.module('builds').directive('preventWindowScroll', ['$window',
	function($window) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				element.bind('mousewheel DOMMouseScroll', function (e) {
			        var delta = e.wheelDelta || (e.originalEvent && e.originalEvent.wheelDelta) || -e.detail,
			            bottomOverflow = this.scrollTop + $(this).outerHeight() - this.scrollHeight >= 0,
			            topOverflow = this.scrollTop <= 0;

			        if ((delta < 0 && bottomOverflow) || (delta > 0 && topOverflow)) {
			            e.preventDefault();
			        }
			    });
			}
		};
	}
]);