'use strict';

angular.module('core').factory('Repository', ['Patches','Items','Runes','Champions','Masteries',
	function(Patches,Items,Runes,Champions,Masteries) {
		var patches 		= [];
		var champions 		= [];
		var items 			= [];
		var runes 			= [];
		var masteries 		= [];
		var selectedPatch 	= [];

		return {
			setSelectedPatch: function(version){
				selectedPatch = version;
			},
			getSelectedPatch : function(){
				return selectedPatch;
			},
			getCachedPatches: function(){
				return patches;
			},
			getPatches: function() {
				var promise = Patches.data.query()
				.$promise.then(function(data) {
					patches = data;
					return { patches: data };
			    });

			    return promise;
			},
			getChampions: function( search_params ) {
				return Champions.data.query(search_params)
				.$promise.then(function(data) {
					champions = data;
					return { champions: data };
			    });
			},
			getItems: function( search_params ){
				return Items.data.query( search_params )
				.$promise.then(function(data) {
					items = data;
					return { items: data };
			    });
			},
			getRunes: function( search_params ){
				return Runes.data.query( search_params )
				.$promise.then(function(data) {
					runes = data;
					return { runes: data};
			    });
			},
			getMasteries: function( search_params ) {
				return Masteries.data.query(search_params)
				.$promise.then(function(data) {
					masteries = data;
					return { masteries: data};
			    });
			}
		};
	}
]);