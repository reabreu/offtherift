'use strict';

angular.module('core').controller('SidebarController', ['$scope', 'Authentication', 'Menus','$spMenu',
	function($scope, Authentication, Menus, $spMenu) {
		$scope.authentication = Authentication;
		$scope.isCollapsed 		= true;

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.checkToggleMenu();
		});

		$scope.toggleMenu = function() {
			$spMenu.toggle();
		}

		$scope.checkToggleMenu = function() {
			if(!$scope.isCollapsed)
				$spMenu.toggle();
			$scope.isCollapsed = false;
		}

		$scope.closeMenu = function() {
			$spMenu.hide();
		}
	}
]);