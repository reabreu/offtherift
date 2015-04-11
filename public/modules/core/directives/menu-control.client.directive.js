'use strict';

angular.module('core').directive('menuControl', ['$spMenu',
    function($spMenu) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {

                var $menu = angular.element('#sp-nav');
                var $page = angular.element('#sp-page');

                var callback;

                // close callback
                var closeCallback = function () {
                    $page.on('click', function (e) {
                        $spMenu.hide();
                        $(this).off(e.type);
                    });
                };

                // define
                switch(attrs.menuControl) {
                    case 'open':
                        elem.on('mouseup', closeCallback);
                        callback = function (e) {
                            e.stopPropagation();

                            $spMenu.open();
                        };
                        break;
                    case 'close':
                        callback = function (e) {
                            e.stopPropagation();

                            $spMenu.hide();
                        };
                        break;
                    default:
                    case 'toggle':
                        if (!$menu.hasClass('show')) {
                            elem.on('mouseup', closeCallback);
                        }
                        callback = function (e) {
                            e.stopPropagation();

                            $spMenu.toggle();
                        };
                        break;
                }

                elem.on('click', callback);

            }
        };
    }
]);
