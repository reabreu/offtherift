'use strict';

angular.module('users').controller('ProfileController', ['$scope', 'Authentication','Builds','ngProgress','$timeout',
	function($scope, Authentication, Builds, ngProgress, $timeout) {
		$scope.authentication = Authentication;

        $scope.addBuild = function(elem, container){
            return function(){
                container.push(elem);
            }
        };

        $scope.initDashboard = function(){
            $scope.search = {
                limit: 5,
                group: 'mine'
            };

            Builds.query($scope.search).$promise.then(function(data){
                console.log(data);
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

            Builds.query($scope.search).$promise.then(function(data){
                $scope.popularBuilds   = [];
                angular.forEach(data, function(build, index){
                    $timeout($scope.addBuild(build,$scope.popularBuilds), index * 300);
                });
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