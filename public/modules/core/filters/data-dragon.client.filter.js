'use strict';

angular.module('core').filter('dataDragon', [
	function() {
		return function(input, type) {
			
			// Data dragon directive logic
			var version	 = '4.20.1/';
			var urlSufix = '';

			switch (type){
				case 'item':
					urlSufix = 'img/item/';
					break;
			}

			return 'http://ddragon.leagueoflegends.com/cdn/'+version + urlSufix + input;
		};
	}
]);