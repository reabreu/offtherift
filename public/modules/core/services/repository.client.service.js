'use strict';

angular.module('core').factory('Repository', ['Patches',
	function(Patches) {
		var patches;

		return {
			getPatches: function( force ) {
				if(angular.isUndefined(patches) || force ){
					patches = Patches.data.query();	
				}
				return patches;
			}
		};
	}
]);