'use strict';

angular.module('core').filter('ddUnversioned', [
	function() {
		return function(key) {
			if(key === undefined) return '#';

            //@TODO Rever o funcionamento deste filtro
            key = key.toString().replace("'", "").replace(" ", "").replace("LeBlanc", "Leblanc").replace("Fiddlesticks","FiddleSticks");

            if (key && !key.match(/\.(png|jpg|gif|jpeg)$/)) {
                key += '_0.jpg';
            }

            return 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/' +  key;
		};
	}
]);