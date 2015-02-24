'use strict';

var translations = {
    HEADLINE: 'What an awesome module!',
    PARAGRAPH: 'Srsly!',
    NAMESPACE: {
        PARAGRAPH: 'And it comes with awesome features!'
    }
};

var translationspt = {
    HEADLINE: 'Que modulo espetacular!!',
    PARAGRAPH: 'Srsly!',
    NAMESPACE: {
        PARAGRAPH: 'And it comes with awesome features!'
    }
};



var app = angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$translate',
	function($scope, Authentication, $translate) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
        $translate('HEADLINE').then(function (headline) {
            $scope.headline = headline;
        });
	}
]);

/*Set up language provider*/
app.config(['$translateProvider', function ($translateProvider) {
    // add translation table
    $translateProvider
    .translations('en', translations)
    .preferredLanguage('pt');
}]);


/**
 * Boostrap UI Modal Template
 */
angular.module("template/modal/window.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/modal/window.html",
    "<div tabindex=\"-1\" role=\"dialog\" class=\"modal\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1250 + index*10, display: 'block'}\" ng-click=\"close($event)\">\n" +
    "    <div class=\"modal-dialog\" ng-class=\"{'modal-sm': size == 'sm', 'modal-lg': size == 'lg'}\"><div class=\"modal-content\" modal-transclude></div></div>\n" +
    "</div>");
}]);