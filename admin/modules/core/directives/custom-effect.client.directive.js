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
					{ 	value 		: 'hp',
						label  		: 'Health'
					},
					{ 	value 		: 'mp',
						label  		: 'Mana'
					},
					{ 	value 		: 'hpregen',
						label  		: 'Health Regeneration'
					},
					{ 	value 		: 'mpregen',
						label  		: 'Mana Regeneration'
					},
					{ 	value 		: 'attackdamage',
						label  		: 'Attack Damage'
					},
					{ 	value 		: 'abilitypower',
						label  		: 'Ability Power'
					},
					{ 	value 		: 'armorpenetration',
						label		: 'Armor Penetration'
					},
					{ 	value 		: 'magicpenetration',
						label  		: 'Magic Penetration'
					},
					{ 	value 		: 'lifesteal',
						label  		: 'Life Steal'
					},
					{ 	value 		: 'spellVamp',
						label  		: 'Spell Vamp'
					},
					{ 	value 		: 'attackspeed',
						label  		: 'Attack Speed'
					},
					{ 	value 		: 'cooldownreduction',
						label  		: 'Cooldown Reduction'
					},
					{ 	value 		: 'critchance',
						label  		: 'Citical Strike Chance'
					},
					{ 	value 		: 'armor',
						label  		: 'Armor'
					},
					
					{ 	value 		: 'spellblock',
						label  		: 'Magic Resistance'
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
					{ 	value 		: 'abilities',
						label		: 'Abilitie'
					},
					{ 	value 		: 'bonusmodifier',
						label		: 'Bonus'
					},
					{ 	value 		: 'basemodifier',
						label		: 'Base Modifier'
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