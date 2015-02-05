'use strict';

angular.module('core').factory('Repository', ['Patches', 'Champions',
	function(Patches, Champions) {
		var patches   = [];
		var champions = [];
		var skip      = 0;
		var limit     = 15;
		var full      = false;

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
			/**
			 * Get Repository cached champions
			 * @return {array} Array of champions
			 */
			getCachedChampions: function(){
				return champions;
			},
			/**
			 * Get champions from server limited
			 * @return {object} Champions
			 */
			getChampions: function() {
				return Champions.data.query({skip: skip, limit: limit})
				.$promise.then(function(data) {

					if (data.length == 0) full = true;

					champions = champions.concat(data);

					skip += limit;

					return { champions: data, full: full };
			    });
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