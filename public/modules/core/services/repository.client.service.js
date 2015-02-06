'use strict';

angular.module('core').factory('Repository', ['Patches','Items',
	function(Patches,Items) {
		var patches = [];

		/*Patches Control vars*/
		var skip  	= 0;
		var limit 	= 15;
		var full 	= false;

		/*Items Control vars*/
		var itemsSkip 		= 0;
		var itemsLimit 		= 15;
		var itemsFull 		= false;

		return {
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
			},
			/****************************
			* 		Items Methods		*
			****************************/
			clearItemPagination: function(){
				itemsSkip 	= 0;
				itemsFull 	= false;
			},
			getItems: function( search_params ){
				search_params.skip 	= itemsSkip;
				search_params.limit 	= itemsLimit;
				var promise = Items.data.query( search_params )
				.$promise.then(function(data) {

					if (data.length == 0) itemsFull = true;

					//items = items.concat(data);

					itemsSkip += itemsLimit;

					return { items: data, full: itemsFull };
			    });

			    return promise;
			}
		};
	}
]);