'use strict';

angular.module('patch').factory('patchService', ['$http','blockUI',
	function($http,blockUI){

		var tmp = {
			patches 		: {},
			patches_order 	: [],
			curr_patch 		: ""
		}
		
		$http.get('https://global.api.pvp.net/api/lol/static-data/euw/v1.2/versions?api_key=02d31520-47fc-4e61-a721-5d84a913229c')
		.success(function(data, status, headers, config) {
			// this callback will be called asynchronously when the response is available
			
			/************ APAGAR: Random Data Generation ************/
			for (var i = 0; i < data.length; i++) {

				if(!data[i].startsWith("4")) continue;

				var rnd  = {
					version: data[i],
					synched: Math.random() < 0.5 ? true : false,
					enabled: Math.random() < 0.5 ? true : false
				}

				tmp.patches[data[i]] = rnd;
				tmp.patches_order.push(data[i]);
			}
			/************ END ERASE ************/
			console.log( tmp.patches);

			tmp.patches_order.sort(function(a,b){
				a 	= 	parseInt(a.replace(".", ""));
				b 	= 	parseInt(b.replace(".", "")); 
				return b-a;
			});

		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs or server returns response with an error status.
			tmp.patches 		= {};
			tmp.patches_order 	= [];
			console.log("There was an error communicating with the API");
		});

		/**
		 * [enablePatch Metodo responsavel por fazer o pedido ao servidor para alterar o estado de um determinado patch no sistema]
		 * @param  {[type]} patch [description]
		 * @return {[type]}       [description]
		 */
		tmp.changePatchState = function( version ){
			tmp.patches[version].enabled = !tmp.patches[version].enabled;
			console.log("Emitir pedido para mudar estado do patch: " + version);
		}

		/**
		 * [synchPatch Metodo responsavel por emitir um pedido de sincronizacao para o servidor]
		 * @param  {[type]} patch [description]
		 * @return {[type]}       [description]
		 */
		tmp.synchPatch = function( version ){
			tmp.patches[version].synched = true;
			console.log("Sincronizar patch: " + version);
		}

		tmp.setCurrentPatch = function(patch){
			tmp.curr_patch = patch;
		}

		return tmp;
	}
]);