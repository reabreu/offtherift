'use strict';

angular.module('builds').directive('itemSection', [
	function() {
		return {
			templateUrl: 'modules/builds/views/item-section.client.view.html',
			restrict: 'E',
			scope: {
				data: 	'=',
				build: 	'='
			},
			controller: function($scope, $element){

				$scope.search = {
					name: null
				}

				$scope.addSnapshot = function(){
					var snap = {
						level: 	1,
						items:  [],
						name: 	'',
						calculatedStats 	: {
							hp: 'n/a',
							mp: 'n/a',
							hpregen: 'n/a',
							mpregen: 'n/a',
							attackdamage: 'n/a',
							abilitypower: 'n/a',
							armorpenetration: 'n/a',
							magicpenetration: 'n/a',
							lifesteal: 'n/a',
							spellvamp: 'n/a',
							attackspeed: 'n/a',
							cooldownreduction: 'n/a',
							critchance: 'n/a',
							armor: 'n/a',
							attackrange: 'n/a',
							spellblock: 'n/a',
							movespeed: 'n/a',
							tenacity: 'n/a'
						}
					};
					$scope.build.snapshot.push(snap);
					$scope.setCurrentSnap($scope.build.snapshot.length-1);
				}

				$scope.setCurrentSnap = function(index){
					$scope.data.currentSnapshot = index;
				}

				$scope.addItem = function(item){
					if ( $scope.build.snapshot[$scope.data.currentSnapshot].items.length < 6) {
						$scope.build.snapshot[$scope.data.currentSnapshot].items.push(item.id);
					}
				}

				$scope.removeItem = function(index){
					$scope.build.snapshot[$scope.data.currentSnapshot].items.splice(index,1);
				}

				$scope.range = function(min, max, step){
					step = step || 1;
					var input = [];
					for (var i = min; i <= max; i += step) input.push(i);
					return input;
				}

				$scope.filterFunction = function(element) {
					if ($scope.search.name === null) return true;
					return element.name.toLowerCase().indexOf($scope.search.name.toLowerCase()) > -1 ? true : false;
				}
		    }
		};
	}
]);