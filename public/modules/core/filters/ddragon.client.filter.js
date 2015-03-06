'use strict';

angular.module('core').filter('ddragon', [
	function() {
		/**
		 * Parses ddragon url to image
		 * @param  {string} key     Element key
		 * @param  {string} version Version
		 * @param  {string} type    champion|item|skill etc
		 * @return {string}         Url parsed
		 */
		return function(key, version, type) {

			if(key === undefined) return '#';

			key = key.toString();

			if (key && !key.match(/\.(png|jpg|gif|jpeg)$/)) {
				key += '.png';
			}

			return 'http://ddragon.leagueoflegends.com/cdn/' + version + '/img/' + type + '/' + key;
		};
	}
]);