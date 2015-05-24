'use strict';

angular.module('core').controller('SidebarController', ['$scope', 'Authentication', 'Menus','$spMenu',
	function($scope, Authentication, Menus, $spMenu) {
		$scope.authentication = Authentication;

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$spMenu.hide();
		});
	}
]);