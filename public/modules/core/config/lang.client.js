'use strict';
var app = angular.module('core').controller('LangController', ['$scope', 'Authentication',
    function($scope, Authentication) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
    }
]);

app.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useUrlLoader('/lang');
    $translateProvider.preferredLanguage('en');
}]);