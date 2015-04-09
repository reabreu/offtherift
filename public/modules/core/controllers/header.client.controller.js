'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus','$spMenu',
	function($scope, Authentication, Menus, $spMenu) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topnav');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};
	}
]);