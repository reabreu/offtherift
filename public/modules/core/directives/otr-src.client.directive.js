'use strict';

angular.module('core').directive('otrSrc', [
	function() {
		return {
			link: function(scope, element, attrs) {
				var srcImage = attrs.otrSrc;

				// Loads image
				var loadImage = function (src) {
					element[0].src = "/modules/core/img/loaders/loader.svg";

					element.bind('load', function(e) {
						e.preventDefault();

						if (this.src !== srcImage) {
							element.fadeOut(function () {
			                	this.src = srcImage;
			                	element.fadeIn();
		                	});
						}
					});
				};

				loadImage(srcImage);

				scope.$watch(function () {
					return attrs.otrSrc;
				}, function (newValue, oldValue) {
					if (oldValue !== newValue) {
						loadImage(newValue);
					}
				});
			}
		};
	}
]);