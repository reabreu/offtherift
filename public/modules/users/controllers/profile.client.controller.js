'use strict';

angular.module('users').controller('ProfileController', ['$scope', 'Authentication','Builds','ngProgress','$timeout',
	function($scope, Authentication, Builds, ngProgress, $timeout) {
		$scope.authentication = Authentication;

        $scope.initDashboard = function(){
            $scope.search = {
                limit: 5,
                group: 'mine'
            };

            Builds.query($scope.search).$promise.then(function(data){
                $scope.builds   = [];
                angular.forEach(data, function(build, index){
                    $timeout(addBuild(build,$scope.builds), index * 300);
                });
            });

            Builds.query($scope.search).$promise.then(function(data){
                $scope.popularBuilds   = [];
                angular.forEach(data, function(build, index){
                    $timeout(addBuild(build,$scope.popularBuilds), index * 300);
                });
            });

            var addBuild = function(elem, container){
                return function(){
                    container.push(elem);
                }
            };
        }
	}
]);