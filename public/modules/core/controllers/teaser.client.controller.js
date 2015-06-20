'use strict';

angular.module('core').controller('TeaserController', ['$scope', '$timeout', '$location', 'Hashes','$rootScope','Pagetitle','Metainformation','$stateParams','popularBuilds','$interval','Userstatistics','Repository',
    function($scope, $timeout, $location, Hashes, $rootScope, Pagetitle, Metainformation, $stateParams,popularBuilds, $interval, Userstatistics,Repository) {

        $scope.already = typeof $location.search().already !== "undefined";

        $scope.errorMessage = "Hello World";
        Metainformation.reset();
        $rootScope.pageKeywords = Metainformation.metaKeywords();
        $rootScope.pageTitle = Pagetitle.setTitle('Home');

        $scope.state = $stateParams.state;
        $scope.champions = {};

        /**
         * Subscribe with specific email
         * @return {boolean} Result
         */
        $scope.subscribe = function () {
            $scope.showMessage = "";
            if (typeof $scope.teaserEmail !== "undefined" &&
                $scope.teaserEmail.match(/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/)) {
                Hashes.subscribe.save({ email: $scope.teaserEmail }, function (res) {
                    $scope.teaserEmail  = "";
                    $scope.showMessage = res.message;
                });
            }
        };

        $scope.runeTypes = {
            'mark': 'Marks',
            'glyph': 'Glyphs',
            'seal': 'Seals',
            'quintessence': 'Quintessences'
        };

        $scope.buildsCountTo      = 0;
        $scope.buildsCountFrom    = 0;

        $scope.initTeaser = function(){
            getChampionsLinks();

            $scope.math = Math;

            $scope.search = {
                days: 40
            };

            popularBuilds.mostPopular.get($scope.search).$promise.then(function(result){
                $scope.popularBuilds   = result.data;
            });

            popularBuilds.mostLiked.get($scope.search).$promise.then(function(result){
                $scope.mostLiked   = result.data;
            });

            popularBuilds.countBuilds.get().$promise.then(function(result){
                $scope.buildsCountTo      = result.num;
                $scope.buildsCountFrom    = result.num* 0.5;
            });

            $timeout( function(){
                Userstatistics.count.get().$promise.then(function(result){
                    $scope.usersCountTo      = result.num;
                    $scope.usersCountFrom    = result.num* 0.5;
                });
            }, 2000);

        };

        function getChampionsLinks() {
            Repository.getPatches().then(function(patchInfo) {
                $scope.formData 		= {
                    enabled: 	true,
                    build:      true,
                    version: 	patchInfo.patches[0].version
                };

                Repository.getChampions($scope.formData).then(function(data) {

                    delete data.$promise;
                    delete data.$resolve;

                    for (var i = 0 ; i < data.champions.length; i++) {
                        $scope.champions = data.champions;
                    }
                });
            });
        }
    }
]);
