'use strict';

angular.module('core').directive('customEffect', ['Repository','$timeout',
	function(Repository,$timeout) {
		return {
			templateUrl: 	'modules/core/views/custom-effect.client.view.html',
			restrict: 		'E',
			scope: {
				target: '=',
				copy: 	'=',
				load: 	'&'
			},
			controller: function($scope, $element){
				//opcoes
				$scope.stats = [
					{ 	value 		: 'armorpenetration',
						label		: 'Armor Penetration'
					},
					{ 	value 		: 'attackdamage',
						label  		: 'Attack Damage'
					},
					{ 	value 		: 'attackspeed',
						label  		: 'Attack Speed'
					},
					{ 	value 		: 'criticalstrikechance',
						label  		: 'Citical Strike Change'
					},
					{ 	value 		: 'criticalstrikedamage',
						label  		: 'Citical Strike Damage'
					},
					{ 	value 		: 'lifesteal',
						label  		: 'Life Steal'
					},
					{ 	value 		: 'armor',
						label  		: 'Armor'
					},
					{ 	value 		: 'health',
						label  		: 'Health'
					},
					{ 	value 		: 'healthregeneration',
						label  		: 'Health Regeneration'
					},
					{ 	value 		: 'spellblock',
						label  		: 'Magic Resistance'
					},
					{ 	value 		: 'ap',
						label  		: 'Ability Power'
					},
					{ 	value 		: 'cooldowndeduction',
						label  		: 'Cooldown Reduction'
					},
					{ 	value 		: 'magicpenetration',
						label  		: 'Magic Penetration'
					},
					{ 	value 		: 'mp',
						label  		: 'Mana'
					},
					{ 	value 		: 'mpregen',
						label  		: 'Mana Regeneration'
					},
					{ 	value 		: 'spellVamp',
						label  		: 'Spell Vamp'
					},
					{ 	value 		: 'movespeed',
						label  		: 'Movement Speed'
					}
				];

				$scope.types = [
					{ 	value 		: 'flat',
						label		: 'Flat'
					},
					{ 	value 		: 'rune',
						label		: 'Rune'
					},
					{ 	value 		: 'masterie',
						label		: 'Masterie'
					},
					{ 	value 		: 'item',
						label		: 'Item'
					},
					{ 	value 		: 'skill',
						label		: 'Skill'
					},
					{ 	value 		: 'bonusmodifier',
						label		: 'Bonus'
					}
				];

				$scope.patches 		= [];
				$scope.patches 		= Repository.getCachedPatches();

				$scope.newEffect 	= function( target ){
					target.customEffect.push({
						dest 	: "armorpenetration",
						value 	: null,
						type 	: 'flat',
						unique 	: false,
						perlevel: false,
						src 	: '',
						name 	: ''
					});
				}

				
				$scope.removeEffect = function ( target, index ){
					target.customEffect.splice(index,1);
				} 
		    }
		};
	}
]);