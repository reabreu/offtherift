'use strict';

angular.module('builds').directive('masteriesSection', [
	function() {
		return {
			templateUrl: 'modules/builds/views/masteries-section.client.view.html',
			restrict: 'E',
			scope: {
				data: 	'=',
				build: 	'='
			},
			controller: function($scope, $element){
				$scope.points = {
					offense: 0,
					defense: 0,
					utility:  0
				};

				$scope.enabled = {
					offense: 4,
					defense: 4,
					utility:  4
				}

				$scope.addRank = function($event, masterie){
					var elem = angular.element($event.currentTarget);

					if(elem.hasClass('mastery-disabled')) return;

					if(masterie.points < masterie.ranks){
						$scope.points[masterie.masteryTree.toLowerCase()]++;
						masterie.points++;

						$scope.updateBuild(masterie);

						if ($scope.points[masterie.masteryTree.toLowerCase()] % 4 == 0)
							$scope.enabled[masterie.masteryTree.toLowerCase()] += 4;
					}
				}

				$scope.removeRank = function($event, masterie){
					var elem = angular.element($event.currentTarget);

					if(elem.hasClass('mastery-disabled')) return;

					if(masterie.points > 0){
						$scope.points[masterie.masteryTree.toLowerCase()]--;
						masterie.points--;

						$scope.updateBuild(masterie);

						if ($scope.points[masterie.masteryTree.toLowerCase()] % 4 == 3)
							$scope.enabled[masterie.masteryTree.toLowerCase()] -= 4;
					}
				}

				$scope.updateBuild = function(masterie){
					//limpa build
					for (var i =0; i < $scope.build.masteries.length; i++) {
						if( masterie.id == $scope.build.masteries[i].id){
							$scope.build.masteries.splice(i,1);
							break;
						}
					}

					//retirar efeitos que queremos adicionar
					for (var i =0; i < masterie.customEffect.length; i++) {
						if( masterie.customEffect[i].rank == masterie.points){
							$scope.build.masteries.push({id: masterie.id, customEffect: masterie.customEffect[i]});
							break;
						}
					}
				}
			}
		};
	}
]);
