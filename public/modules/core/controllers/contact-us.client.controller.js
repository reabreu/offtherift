'use strict';

angular.module('core').controller('ContactUsController', ['$scope', 'Authentication', 'Menus','$window','$rootScope','Pagetitle','Metainformation',
    function($scope, Authentication, Menus, $window, $rootScope, Pagetitle, Metainformation) {
        $scope.setSquaresHeight = function(){
            var windowHeight    = $window.innerHeight;
            var finalHeight     = Math.max(((windowHeight-165) / 2),250);
            angular.element('.about-us-square').height(finalHeight);
        };

        $scope.initAboutUs = function(){
            Metainformation.reset();
            $rootScope.pageKeywords = Metainformation.metaKeywords();
            $rootScope.pageTitle    = Pagetitle.setTitle('About us');
            $scope.setSquaresHeight();
        }

        var w = angular.element($window);

        w.bind('resize', function () {
            $scope.setSquaresHeight();
        });
    }
]);