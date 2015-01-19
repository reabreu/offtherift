'use strict';

angular.module('item').factory('itemService', ['$http','$rootScope',
	function($http,$rootScope) {
		var tmp = {
			items: {}
		}

		tmp.getItems = function( patch ){
			tmp.items = {};

			$http.get("https://global.api.pvp.net/api/lol/static-data/euw/v1.2/item?itemListData=all&version="+patch+"&api_key=02d31520-47fc-4e61-a721-5d84a913229c")
			.success(function(data, status, headers, config) {
				// this callback will be called asynchronously when the response is available
				tmp.items = data.data;
				
			}).error(function(data, status, headers, config) {
				// called asynchronously if an error occur or server returns response with an error status.
				console.log("There was an error communicating with the API!");
				return {};
			});
		};

		tmp.cleanItems = function(){
			tmp.items = {};
		}

		return tmp;
	}
]);