'use strict';

angular.module('core').controller('TeaserController', ['$scope', '$timeout', '$location', 'Hashes','$rootScope','Pagetitle','Metainformation','$stateParams','popularBuilds', 'Repository', '$interval',
    function($scope, $timeout, $location, Hashes, $rootScope, Pagetitle, Metainformation, $stateParams,popularBuilds, Repository, $interval) {

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
            if (typeof $scope.teaserEmail !== "undefined" &&
                $scope.teaserEmail.match(/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/)) {
                Hashes.subscribe.save({ email: $scope.teaserEmail }, function (res) {
                    $scope.teaserEmail  = "";
                    var msg = $scope.showMessage;
                    $scope.showMessage = res.message;
                    $timeout(function() {
                        $scope.showMessage = msg;
                    }, 5000);
                });
            }
        };

        $scope.runeTypes = {
            'mark': 'Marks',
            'glyph': 'Glyphs',
            'seal': 'Seals',
            'quintessence': 'Quintessences'
        };


        $scope.initTeaser = function(){

            getChampionsLinks();

            $scope.math = Math;

            $scope.search = {
                days: 40
            };

            popularBuilds.mostPopular.get($scope.search).$promise.then(function(result){
                $scope.popularBuilds   = result.data;
            });

            popularBuilds.mostCommented.get($scope.search).$promise.then(function(result){
                $scope.mostCommented   = result.data;
            });

            popularBuilds.mostShared.get($scope.search).$promise.then(function(result){
                $scope.mostShared   = result.data;
            });

            popularBuilds.mostLiked.get($scope.search).$promise.then(function(result){
                $scope.mostLiked   = result.data;
            });

        };

        function getChampionsLinks() {
            Repository.getPatches().then(function(patchInfo) {
                $scope.formData 		= {
                    enabled: 	true,
                    build:      true,
                    version: 	patchInfo.patches[0].version
                };

                Repository.getChampions($scope.formData).then(function(data) {
                    for (var i = 0 ; i < data.champions.length; i++) {
                        $scope.champions = data.champions;
                    }
                });
            });
        }

        $scope.addBuild = function(elem, container){
            return function(){
                container.push(elem);
            }
        };
    }
]);
