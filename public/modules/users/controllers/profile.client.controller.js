'use strict';

angular.module('users').controller('ProfileController', ['$scope', 'Authentication','Builds','ngProgress','$timeout','popularBuilds','Statistics','$rootScope','Pagetitle','Metainformation',
	function($scope, Authentication, Builds, ngProgress, $timeout,popularBuilds,Statistics, $rootScope, Pagetitle, Metainformation) {
		$scope.authentication = Authentication;

        $scope.addBuild = function(elem, container){
            return function(){
                container.push(elem);
            }
        };

        $scope.initDashboard = function(){
            Metainformation.reset();
            $rootScope.pageKeywords = Metainformation.metaKeywords();
            $rootScope.pageTitle    = Pagetitle.setTitle('Dashboard');

            $scope.search = {
                limit: 5,
                group: 'mine'
            };

            Builds.query($scope.search).$promise.then(function(data){
                $scope.builds   = [];
                $scope.emptyBuilds   = [];

                for( var i = 0; i<5; i++){
                    if( typeof(data[i]) != "undefined"){
                        $timeout($scope.addBuild(data[i],$scope.builds), i * 300);
                    }else{
                        $timeout($scope.addBuild([],$scope.emptyBuilds), i * 300);
                    }
                }
            });

            $scope.search = {
                limit: 5,
                days: 80
            };

            popularBuilds.query($scope.search).$promise.then(function(data){
                $scope.popularBuilds   = [];
                angular.forEach(data, function(build, index){
                    $timeout($scope.addBuild(build,$scope.popularBuilds), index * 300);
                });
            });

            Statistics.query().$promise.then(function(data){
                $scope.statistics = data[0];
            });
        }

        /**
         * Generate an array of number to loop with ng-repeat
         */
        $scope.range = function(min, max, step){
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) input.push(i);
            return input;
        };
	}
]);
