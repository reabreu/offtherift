'use strict';

angular.module('builds').directive('masteriesSection', ['$state',
	function($state) {
		return {
			templateUrl: 'modules/builds/views/masteries-section.client.view.html',
			restrict: 'E',
			scope: {
				data: 	'=',
				build: 	'=',
				children: '='
			},
			controller: function($scope, $element){

				$scope.buildMode = $state.current.name;

				if( $scope.buildMode != "viewBuild")
					$scope.children.masteries = $scope;

				$scope.addRank = function($event, masterie){
					if( $scope.buildMode == "viewBuild") return;

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

					if( $scope.buildMode == "viewBuild") return;

					var elem = angular.element($event.currentTarget);

					if(elem.hasClass('mastery-disabled')) return;

					//verificar se esta masterie é uma depedencia de outra e se essa outra tem pontos
					for (var i = 0; i < $scope.data.masteries.length; i++) {
						if( $scope.data.masteries[i].prereq == masterie.id.toString() &&  $scope.data.masteries[i].points > 0){
							return;
						}
					}
					console.log('aquiii3');

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
					for (var i = $scope.build.masteries.length - 1; i >= 0; i--) {
						if( masterie.id == $scope.build.masteries[i].id){
							$scope.build.masteries.splice(i,1);
						}
					};

					var length = masterie.customEffect.length;
					//retirar efeitos que queremos adicionar
					for (var i =0; i < length; i++) {
						if( masterie.customEffect[i].rank == masterie.points){
							$scope.build.masteries.push({id: masterie.id, customEffect: masterie.customEffect[i]});
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
