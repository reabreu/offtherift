'use strict';

angular.module('core').factory('Championbackground', [
	function() {
		// Championbackground service logic
		// ...

		// Public API
		return {
			setChampionBackground: function(key) {
				var element = angular.element('.champion-splash');
				element.css({
		            'background-image': 'url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + key +'_0.jpg)',
		        });
			}
		};
	}
]);