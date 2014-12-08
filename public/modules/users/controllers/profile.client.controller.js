'use strict';

angular.module('users').controller('ProfileController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.authentication = Authentication;
	}
]);