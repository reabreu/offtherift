'use strict';

angular.module('core').factory('$otrModal', ['$modal','$timeout',
	function($modal, $timeout) {
		return {
			/**
			 * Angular Bootstrap UI Overriden
			 * @param  {object}  options Modal Options
			 * @return {objecto}         Bootstrap UI Object
			 */
			open: function (options) {
				var modalInstance = $modal.open(options);

				modalInstance.opened.then(function(e) {
					$timeout(function() {
						var marginHeight = 1;

						var $m = angular.element('.modal.in');

						var $h = $m.find('.modal-header:first');
						var $b = $m.find('.modal-body:first');
						var $f = $m.find('.modal-footer:first');
						var $c = $m.find('.container-fluid:first');

						// Window full height
						var height = window.innerHeight;

						// Decrement header height
						if ($h.length > 0) {
							height -= $h[0].offsetHeight + marginHeight;
						}
						// Decrement footer height
						if ($f.length > 0) {
							height -= $f[0].offsetHeight + marginHeight;
						}

						$b.css('height', height);
						$c.css('height', height);
					}, 100);
				});

				return modalInstance;
			}
		};
	}
]);