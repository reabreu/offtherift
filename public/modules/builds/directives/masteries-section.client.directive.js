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

				$scope.addRank = function($event, masterie){
					var elem = angular.element($event.currentTarget);

					if(elem.hasClass('mastery-disabled') || $scope.build.masteries_aux.avaliable_points == 0) return;

					if(masterie.points < masterie.ranks){
						$scope.build.masteries_aux.points[masterie.masteryTree.toLowerCase()]++;
						masterie.points++;
						$scope.build.masteries_aux.avaliable_points--;

						$scope.updateBuild(masterie);

						if ($scope.build.masteries_aux.points[masterie.masteryTree.toLowerCase()] % 4 == 0)
							$scope.build.masteries_aux.enabled[masterie.masteryTree.toLowerCase()] += 4;
					}
				}

				$scope.removeRank = function($event, masterie){
					var elem = angular.element($event.currentTarget);

					if(elem.hasClass('mastery-disabled') || $scope.build.masteries_aux.avaliable_points == 0) return;

					//verificar se esta masterie é uma depedencia de outra e se essa outra tem pontos
					for (var i = 0; i < $scope.data.masteries.length; i++) {
						if( $scope.data.masteries[i].prereq == masterie.id.toString() &&  $scope.data.masteries[i].points > 0){
							return;
						}
					}

					if(masterie.points > 0){
						$scope.build.masteries_aux.points[masterie.masteryTree.toLowerCase()]--;
						masterie.points--;
						$scope.build.masteries_aux.avaliable_points++;

						$scope.updateBuild(masterie);

						if ($scope.build.masteries_aux.points[masterie.masteryTree.toLowerCase()] % 4 == 3)
							$scope.build.masteries_aux.enabled[masterie.masteryTree.toLowerCase()] -= 4;
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

				$scope.checkDependecy = function(masterie){
					if (masterie.prereq == "0"){
						return true;
					} else {
						//verificar se a masterie em questao tem o rank total
						for (var i = 0; i < $scope.data.masteries.length; i++) {
							if( $scope.data.masteries[i].id.toString() == masterie.prereq && $scope.data.masteries[i].points == $scope.data.masteries[i].ranks){
								return true;
							}
						}
					}
					return false;
				}
			}
		};
	}
]);
