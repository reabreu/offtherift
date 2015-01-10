'use strict';

// Configuring the Articles module
angular.module('patches').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		/*
		Menus.addMenuItem('sidebar', 'Patches', 'patches', 'dropdown', '/patches(/create)?');
		Menus.addSubMenuItem('sidebar', 'patches', 'List Patches', 'patches');
		Menus.addSubMenuItem('sidebar', 'patches', 'New Patch', 'patches/create');*/
	}
]);