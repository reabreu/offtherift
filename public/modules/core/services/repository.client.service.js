'use strict';

angular.module('core').factory('Repository', ['Patches','Items','Runes','Champions','Masteries',
	function(Patches,Items,Runes,Champions,Masteries) {
		var _this = this;

		var patches 		= [];
		var champions 		= [];
		var items 			= [];
		var runes 			= [];
		var masteries 		= [];
		var selectedPatch 	= [];

		/**
		 * Loading states
		 * @type {Object}
		 */
		this.loading = {
			patches: true,
			champions: true,
			items: true,
			runes: true,
			masteries: true
		};

		return {
			/**
			 * Loading State Flag
			 * @type {Object}
			 */
			loading: this.loading,
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
				this.loading.patches = true;
				var promise = Patches.data.query()
				.$promise.then(function(data) {
					patches = data;
					_this.loading.patches = false;
					return { patches: data };
			    });

			    return promise;
			},
			getChampions: function( search_params ) {
				this.loading.champions = true;
				return Champions.data.query(search_params)
				.$promise.then(function(data) {
					champions = data;
					_this.loading.champions = false;
					return { champions: data };
			    });
			},
			getItems: function( search_params ){
				this.loading.items = true;
				return Items.data.query( search_params )
				.$promise.then(function(data) {
					items = data;
					_this.loading.items = false;
					return { items: data };
			    });
			},
			getRunes: function( search_params ){
				this.loading.runes = true;
				return Runes.data.query( search_params )
				.$promise.then(function(data) {
					runes = data;
					_this.loading.runes = false;
					return { runes: data};
			    });
			},
			getMasteries: function( search_params ) {
				this.loading.masteries = true;
				return Masteries.data.query(search_params)
				.$promise.then(function(data) {
					masteries = data;
					_this.loading.masteries = false;
					return { masteries: data};
			    });
			}
		};
	}
]);