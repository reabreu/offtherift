'use strict';

angular.module('core').factory('Repository', ['Patches',
	function(Patches) {
		var patches = [];
		var skip  	= 0;
		var limit 	= 15;
		var full 	= false;

		return {
			getFull: function(){
				return full;
			},
			getCachedPatches: function(){
				return patches;
			},
			getPatches: function() {
				var promise = Patches.data.query({skip: skip, limit: limit})
				.$promise.then(function(data) {

					if (data.length == 0) full = true;

					patches = patches.concat(data);

					skip += limit;

					return { patches: data, full: full };
			    });

			    return promise;
			},
			clearPagination: function(){
				skip 	= 0;
				patches = [];
				full 	= false;
			},
			sincronizePatch: function( patch ){
				
				var promise = Patches.sincronizePatch.get({patchVersion: patch.version})
				.$promise.then(function(data) {
					//process answer on repository
					return data;
			    });

			    return promise;
			}
		};
	}
]);