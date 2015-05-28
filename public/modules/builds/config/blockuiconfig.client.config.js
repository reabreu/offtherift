'use strict';

// Builds module config
angular.module('builds').config(['blockUIConfig',
	function(blockUIConfig) {

	// Disable automatically blocking of the user interface
	blockUIConfig.autoBlock = false;

}]).run(['Menus',
	function(Menus) {
		// Config logic
		// ...
	}
]);