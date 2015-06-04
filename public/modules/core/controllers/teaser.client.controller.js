'use strict';

angular.module('core').controller('TeaserController', ['$scope', '$timeout', '$location', 'Hashes', '$stateParams',
    function($scope, $timeout, $location, Hashes, $stateParams) {

        $scope.already = typeof $location.search().already !== "undefined";

        $scope.errorMessage = "Hello World";

        $scope.teaserEmail = "paulocaldeira17@gmail.com";

        $scope.state = $stateParams.state;

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
    }
]);
