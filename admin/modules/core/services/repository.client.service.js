'use strict';

angular.module('core').factory('Repository', ['Patches','Items','Runes','Champions',
	function(Patches,Items,Runes,Champions) {
		var patches 	= [];

		/*Patches Control vars*/
		var skip  			= 0;
		var limit 			= 15;
		var full 			= false;

		/*Items Control vars*/
		var itemsSkip 		= 0;
		var itemsLimit 		= 15;
		var itemsFull 		= false;

		/*Runes Control vars*/
		var runesSkip 		= 0;
		var runesLimit 		= 15;
		var runesFull 		= false;

		/*Champions Control vars*/
		var championsSkip 	= 0;
		var championsLimit 	= 15;
		var championsFull 	= false;

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
				search_params.skip 		= itemsSkip;
				search_params.limit 	= itemsLimit;
				var promise 			= Items.data.query( search_params )
				.$promise.then(function(data) {

					if (data.length == 0) itemsFull = true;

					//items = items.concat(data);

					itemsSkip += itemsLimit;

					return { items: data, full: itemsFull };
			    });

			    return promise;
			},
			/****************************
			* 		Runes Methods		*
			****************************/
			clearRunePagination: function(){
				runesSkip 	= 0;
				runesFull 	= false;
			},
			getRunes: function( search_params ){
				search_params.skip 		= runesSkip;
				search_params.limit 	= runesLimit;
				var promise = Runes.data.query( search_params )
				.$promise.then(function(data) {

					if (data.length == 0) runesFull = true;

					runesSkip += itemsLimit;
					
					return { runes: data, full: runesFull };
			    });

			    return promise;
			},
			/****************************
			* 		Champion Methods	*
			****************************/
			getChampions: function( search_params ) {
				search_params.skip 		= championsSkip;
				search_params.limit 	= championsLimit;

				return Champions.data.query(search_params)
				.$promise.then(function(data) {

					if (data.length == 0) championsFull = true;
					
					championsSkip += championsLimit;

					return { champions: data, full: championsFull };
			    });
			},
			clearChampionPagination: function(){
				championsSkip 	= 0;
				championsFull 	= false;
			},
		};
	}
]);