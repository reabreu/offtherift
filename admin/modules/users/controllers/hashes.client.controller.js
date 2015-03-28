'use strict';

angular.module('users').controller('HashesController', ['$scope', '$http', '$location',
    'Authentication', 'Hashes', 'ngToast',
    function($scope, $http, $location, Authentication, Hashes, ngToast) {
        $scope.authentication = Authentication;

        // If user is signed in then redirect back home
        if ($scope.authentication.user) $location.path('/');

        $scope.hashes = {};

        /**
         * On view init
         * @return {boolean} Result
         */
        $scope.init = function() {
            $scope.hashes = Hashes.data.query();
            return true;
        };

        /**
         * On search by attributes
         * @return {boolean} Result
         */
        $scope.search = function() {
            $scope.hashes = Hashes.data.query($scope.formData);
            return true;
        };

        /**
         * Generate hashes by number or email
         * @return {boolean}
         */
        $scope.generate = function () {
            // email or number
            var input = $scope.generateValue;
            if (input) {
                Hashes.generate.save({ input: input }, function (res) {
                    $scope.generateValue = "";
                    ngToast.create({
                        content: res.message,
                        className: res.success ? 'success' : 'danger'
                    });
                    $scope.init();
                });
            };
        };

        /**
         * Removes some hash by ObjectId
         */
        $scope.remove = function (objectId) {
            if (objectId) {
                Hashes.generate.delete({ id: objectId }, function (res) {
                    ngToast.create({
                        content: res.message,
                        className: res.success ? 'success' : 'danger'
                    });
                    $scope.init();
                });
            };
        }

    }
]);