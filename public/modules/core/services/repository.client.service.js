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
		this.state = {
			patches: {
				loading: true,
				full: false
			},
			champions: {
				loading: true,
				full: false
			},
			items: {
				loading: true,
				full: false
			},
			runes: {
				loading: true,
				full: false
			},
			masteries: {
				loading: true,
				full: false
			}
		};

		return {
			/**
			 * Loading State Flag
			 * @type {Object}
			 */
			state: this.state,
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
				this.state.patches.loading = true;
				var promise = Patches.data.query()
				.$promise.then(function(data) {
					patches = data;

					// set loading state
					_this.state.patches.loading = false;

					// check if it's full
					if (typeof data !== "undefined" &&
						data.length == 0) {
						_this.state.patches.full = true;
					}

					return { patches: data };
			    });

			    return promise;
			},
			getChampions: function( search_params ) {
				this.state.champions.loading = true;
				return Champions.data.query(search_params)
				.$promise.then(function(data) {
					champions = data;

					// set loading state
					_this.state.champions.loading = false;

					// check if it's full
					if (typeof data !== "undefined" &&
						data.length == 0) {
						_this.state.champions.full = true;
					}

					return { champions: data };
			    });
			},
			getItems: function( search_params ){
				this.state.items.loading = true;
				return Items.data.query( search_params )
				.$promise.then(function(data) {
					items = data;

					// set loading state
					_this.state.items.loading = false;

					// check if it's full
					if (typeof data !== "undefined" &&
						data.length == 0) {
						_this.state.items.full = true;
					}

					return { items: data };
			    });
			},
			getRunes: function( search_params ){
				this.state.runes.loading = true;
				return Runes.data.query( search_params )
				.$promise.then(function(data) {
					runes = data;

					// set loading state
					_this.state.runes.loading = false;

					// check if it's full
					if (typeof data !== "undefined" &&
						data.length == 0) {
						_this.state.runes.full = true;
					}

					return { runes: data};
			    });
			},
			getMasteries: function( search_params ) {
				this.state.masteries.loading = true;
				return Masteries.data.query(search_params)
				.$promise.then(function(data) {
					masteries = data;

					// set loading state
					_this.state.masteries.loading = false;

					// check if it's full
					if (typeof data !== "undefined" &&
						data.length == 0) {
						_this.state.masteries.full = true;
					}

					return { masteries: data};
			    });
			}
		};
	}
]);