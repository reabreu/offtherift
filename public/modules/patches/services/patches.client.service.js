'use strict';

//Patches service used to communicate Patches REST endpoints
angular.module('patches').factory('Patches', ['$resource',
	function($resource) {
		return { 
			data: 				$resource('patches/:patchId', { patchId: '@_id' }, 
			{
				update: {
					method: 'PUT'
				}
			}),
			checkPatches: 		$resource('patches/sync'),
			sincronizePatch: 	$resource('patches/syncPatch/:patchVersion', { patchVersion: '@version' })
		};
	}
]);