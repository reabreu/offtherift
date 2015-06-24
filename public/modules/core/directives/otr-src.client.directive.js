'use strict';

angular.module('core').directive('otrSrc', [
	function() {
		return {
			link: function(scope, element, attrs) {
				var srcImage = attrs.otrSrc;

				if(element.hasClass('build-portrait'))
					element.addClass('label-portrait');


				var loadImage = function (src) {
					element[0].src = "/modules/core/img/loaders/loader.svg";

					element.off('load').on('load', function(e) {
						e.preventDefault();
						if (this.src !== src) {
							element.fadeOut(function () {
			                	this.src = src;

			                	element.fadeIn(function(){
			                		element.removeClass('label-portrait');
			                	});
		                	});
						}
					});
				};

				/**
				 * Verify if image is cached on browser
				 * @param  {string}  src Image Url
				 * @return {Boolean}     Cached
				 */
				var isCached = function (src) {
					var image = new Image();
					image.src = src;

					return image.complete;
				};

				if (!isCached(attrs.otrSrc)) { // not cached
					loadImage(srcImage);

					scope.$watch(function () {
						return attrs.otrSrc;
					}, function (newValue, oldValue) {
						if (oldValue !== newValue) {
							loadImage(newValue);
						}
					});
				} else { // cached
					element[0].src = attrs.otrSrc;
					element.removeClass('label-portrait');
				}
			}
		};
	}
]);