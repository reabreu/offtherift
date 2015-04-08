'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');

exports.calculate = function(req, res) {
	res.jsonp(module.exports.processStats(req.body, res.isAdmin));
};

/**
 * Calculate
 */
exports.processStats = function(request, admin) {
	var errors = validate(request);

	if(admin && errors.length) {
		console.log(errors);
	};

	// growth per lvl: (nextLevel * 3.5) + 65
	var growth = {
		"1" 	: 0.0000,
		"2" 	: 0.7200,
		"3" 	: 1.4750,
		"4"		: 2.2650,
		"5" 	: 3.0900,
		"6" 	: 3.9500,
		"7" 	: 4.8450,
		"8" 	: 5.7750,
		"9" 	: 6.7400,
		"10"	: 7.7400,
		"11"	: 8.7750,
		"12"	: 9.8450,
		"13"	: 10.950,
		"14"	: 12.090,
		"15"	: 13.265,
		"16"	: 14.475,
		"17"	: 15.720,
		"18"	: 17.000
	};

	// Structure to control allowed effects
	var partymap = {energy: "Energy", energyregen: "Energy", mp: "Mana", mpregen: "Mana"};

	// Structure of the stats with all the necessary components to
	// calculate each stat's value
	var stats = {
		hp: {
			name: "hp",
			base: request.stats.hp + growth[request.level] * request.stats.hpperlevel,
			dependencies: [], // {name: source, coef: percentValue}
			modifiers: {
				flat: 			0.0,
                globalCoef:         0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[],
                globalmodifiers:[]
			}
		},
		mp: {
			name: "mp",
			base: request.stats.mp + growth[request.level] * request.stats.mpperlevel,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
                globalCoef:         0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[],
                globalmodifiers:[]
			}
		},
		hpregen: {
			name: "hpregen",
			base: request.stats.hpregen + growth[request.level] * request.stats.hpregenperlevel,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
                globalCoef:         0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[],
                globalmodifiers:[]
			}
		},
		mpregen: {
			name: "mpregen",
			base: request.stats.mpregen + growth[request.level] * request.stats.mpregenperlevel,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
                globalCoef:         0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[],
                globalmodifiers:[]
			}
		},
		attackdamage: {
			name: "attackdamage",
			base: request.stats.attackdamage + growth[request.level] * request.stats.attackdamageperlevel,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
                globalCoef:         0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[],
                globalmodifiers:[]
			}
		},
		abilitypower: {
			name: "abilitypower",
			base: 0,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
                globalCoef:         0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[],
                globalmodifiers:[]
			}
		},
		armorpenetration: {
			name: "armorpenetration",
			base: 0,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
                globalCoef:         0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[],
                globalmodifiers:[]
			}
		},
		magicpenetration: {
			name: "magicpenetration",
			base: 0,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
                globalCoef:         0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[],
                globalmodifiers:[]
			}
		},
		lifesteal: {
			name: "lifesteal",
			base: 0,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
                globalCoef:         0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[],
                globalmodifiers:[]
			}
		},
		spellvamp: {
			name: "spellvamp",
			base: 0,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
                globalCoef:         0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[],
                globalmodifiers:[]
			}
		},
		attackspeed: {
			name: "attackspeed",
			base: 0.625 / (1 + request.stats.attackspeedoffset),
			dependencies: [],
			modifiers: {
				flat: 			0.0,
                globalCoef:         0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[growth[request.level] * request.stats.attackspeedperlevel * 0.01],
                globalmodifiers:[]
			}
		},
		cooldownreduction: {
			name: "cooldownreduction",
			base: 0,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
                globalCoef:         0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[],
                globalmodifiers:[]
			}
		},
		critchance: {
			name: "critchance",
			base: 0,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
                globalCoef:         0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[],
                globalmodifiers:[]
			}
		},
		armor: {
			name: "armor",
			base: request.stats.armor + growth[request.level] * request.stats.armorperlevel,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
                globalCoef:         0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[],
                globalmodifiers:[]
			}
		},
		attackrange: {
			name: "attackrange",
			base: request.stats.attackrange,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
                globalCoef:         0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[],
                globalmodifiers:[]
			}
		},
		spellblock: {
			name: "spellblock",
			base: request.stats.spellblock + growth[request.level] * request.stats.spellblockperlevel,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
                globalCoef:         0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[],
                globalmodifiers:[]
			}
		},
		movespeed: {
			name: "movespeed",
			base: request.stats.movespeed,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
                globalCoef:         0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[],
                globalmodifiers:[]
			}
		},
		tenacity: {
			name: "tenacity",
			base: 0,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
                globalCoef:         0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[],
                globalmodifiers:[]
			}
		}
	};

	// List containing all the unique names found.
	var uniques = [];

	// Apply flat effect, store percent modifiers and get effects with dependencies.
	var effectCount = request.effects.length;
	for (var i = 0; i < effectCount; i++) {
		var effect = request.effects[i];
		effect.value = parseFloat(effect.value);

		if ( effect.dest in partymap && partymap[effect.dest] != request.partype) {
			continue;
		}

		//Mini vergalhada XD
		if(effect.dest == "energy")		 effect.dest = "mp";
		if(effect.dest == "energyregen") effect.dest = "mpregen";

		// If the effect has dependencies, save it for later.
		if (effect.src != "") {
			stats[effect.dest].dependencies.push({name: effect.src, coef: effect.value});
			continue;
		}

		// Add flat bonus from normal or unprocessed uniques.
		if ( !effect.unique  || (effect.unique && (uniques.indexOf(effect.name)) == -1) ) {

			// If the effect is unique, get highest unique
			if (effect.unique) {
				effect.value = getHighestEffectValue(request.effects,effect.name);
			}

			// If the value is applied per level, set value to appropriate level.
			if (effect.perlevel) {
				effect.value *= request.level;
			}

			// "Move" the effect's value to the correct place.
			if (effect.type === "flat") {
				stats[effect.dest].modifiers.flat += effect.value;
			}
            else {
                if (effect.global) {
                    stats[effect.dest].modifiers.globalCoef += effect.value;
                } else {
                    stats[effect.dest].modifiers['globalmodifiers'].push(effect.value);
                }

                stats[effect.dest].modifiers[effect.type].push(effect.value);
			}

			if (effect.unique) uniques.push(effect.name);
		}
	}

	var response = {data: {}};

	// Calculate independent stats first.
	for (var key in stats) {
		var stat = stats[key];

		if (stat.dependencies.length) continue; // skip dependencies

		response.data[stat.name] = calculateStatValue(stat, response.data);
	}

	// Calculate dependent stats.
	for (var key in stats) {
		var stat = stats[key];

		if (!stat.dependencies.length) continue; // skip independent stats

		response.data[stat.name] = calculateStatValue(stat, response.data);
	}

	// Format stats according to the in-game stats window.
	for (var key in response.data) {
		switch (key) {
			case "hp":
				response.data[key] = Math.ceil(response.data[key]);
				break;
			case "mp":
				response.data[key] = Math.floor(response.data[key]);
				break;
			case "attackspeed":
				response.data[key] = Math.min(response.data[key], 2.5);
				response.data[key] = parseFloat(response.data[key].toFixed(2));
				break;
			case "cooldownreduction":
				response.data[key] = Math.min(response.data[key], 40);
				response.data[key] = parseFloat(response.data[key].toFixed(2));
				break;
			case "critchance":
				response.data[key] = Math.min(response.data[key], 100);
				response.data[key] = Math.round(response.data[key]);
				break;
			case "movespeed":
				var secondCap 		= Math.max((response.data[key] - 490), 0) * 0.5;
				var firstCap  		= Math.min(parseFloat(Math.max(response.data[key] - 415, 0)), 75) * 0.8;
				response.data[key] 	= parseInt(Math.round(secondCap + firstCap + Math.min(response.data[key], 415)));
				break;
			case "armorpenetration":
			case "magicpenetration":
			case "hpregen":
			case "mpregen":
				break;
			default:
				response.data[key] = Math.round(response.data[key]);
				break;
		}
	}

	return response;
	//res.jsonp({response: response, stats: stats});
};

/**
 * Calculates the final stat value according to the provided stat structure
 * and the stats that have been calculated so far.
 * @param  {[type]}
 * 				Stat structure with bonuses to be applied.
 * @param  {[type]}
 * 				Stats calculated so far ({stat: value, stat2: value2})
 * @return {[type]}
 * 				Final value for the stat after applying bonuses.
 */
function calculateStatValue(stat, resStats) {
	var runesModifier		= calculateRunesModifier(stat.name, stat.modifiers.runes);
	var masteriesModifier 	= calculateMasteriesModifier(stat.name, stat.modifiers.masteries);
	var itemsModifier 		= calculateItemsModifier(stat.name, stat.modifiers.items);
	var abilitiesModifier	= calculateAbilitiesModifier(stat.name, stat.modifiers.abilities);
	var flatBonus			= calculateFlatBonus(stat.dependencies, resStats) + stat.modifiers.flat;
	var statModifier		= calculateModifier(stat.name, runesModifier, masteriesModifier, itemsModifier, abilitiesModifier);
	var bonusModifier		= calculateBonusModifier(stat.name, stat.modifiers.bonusmodifier);
	var baseModifier 		= calculateBaseModifier(stat.name, stat.modifiers.basemodifier);
    var globalCoef          = calculateGlobalCoef(stat.name, stat.modifiers.globalCoef, stat.modifiers.globalmodifiers);

	var converted 			= statModifier.toFixed(5);
	statModifier 			= parseFloat(converted);

	switch (stat.name) {
		case "attackspeed":
			return stat.base * (1 + statModifier);
		case "armorpenetration":
		case "magicpenetration":
			return [flatBonus, (statModifier*100)];
		case "tenacity":
			return statModifier*100;
		case "movespeed":
			var totalFlat = stat.base+flatBonus;
			return totalFlat*(itemsModifier+abilitiesModifier) + totalFlat*(statModifier);
		default:
			var baseCoef 	= stat.base*baseModifier;
			var maxStat		= stat.base + baseCoef + flatBonus; // @TODO: Check if baseCoef affects maxStat
			var statBonus 	= baseCoef + flatBonus + maxStat * statModifier;

			// if (stat.name === "abilitypower")
			// 	console.log(stat);

            console.log("Bonus " + stat.name + ": +" + bonusModifier*100 + "% (+" + statBonus * bonusModifier +")");
            console.log("GlobalCoef " + stat.name + ": " + globalCoef);

            var val = 0;
            if (stat.name == "hp") {
                statBonus 	= maxStat - stat.base;
                val = (stat.base + statBonus * (1 + bonusModifier)) * globalCoef * (1+runesModifier+masteriesModifier);
            } else {
                val = (stat.base + statBonus * (1 + bonusModifier)) * globalCoef;
            }

           	if (stat.name === "mpregen" || stat.name === "hpregen"){
           		return [parseInt(Math.round(val)), parseInt(Math.round(stat.base))];
           	} else {
           		return val;
           	}
	}
}

function calculateGlobalCoef(name, globalCoef, globalModifiers) {
    if (globalCoef == 0 || globalModifiers.length == 0) return 1;

    var bonus = 1.0;
    var precision = 0.00000001;
    var totalModifier = 1;

    // Calculate the cumulative bonus from the modifiers (multiplicative).
    for (var i = globalModifiers.length-1; i >= 0; i--) {
        totalModifier *= globalModifiers[i];
    }

    var k = 1;
    var lastIteration = 0.0;
    do {
        lastIteration = Math.pow(globalCoef, k) * totalModifier;
        bonus += lastIteration;

        k++;
    } while (lastIteration > precision);

    return bonus;
}

/**
 * Calculates the cumulative modifier from all the different sources.
 * @param  {[type]}
 * 				Stat name.
 * @param  {[type]}
 * 				Cumulative modifier from runes.
 * @param  {[type]}
 * 				Cumulative modifier from the masteries.
 * @param  {[type]}
 * 				Cumulative modifier from the items.
 * @param  {[type]}
 * 				Cumulative modifier from the abilities.
 * @return {float}
 * 				Cumulative modifier for the given stat.
 */
function calculateModifier(stat, runeMod, masteryMod, itemMod, abilityMod) {
	switch (stat) {
		case "attackdamage": // stacks additively between sources
		case "attackspeed":
		case "cooldownreduction":
		case "critchance":
			return runeMod + masteryMod + itemMod + abilityMod;
		case "armorpenetration":
		case "magicpenetration":
		case "tenacity":
			return 1-((1-runeMod)*(1-masteryMod)*(1-itemMod)*(1-abilityMod));
		case "movespeed":
			return masteryMod*runeMod;
		default:
			var summonerMod = runeMod + masteryMod;

			summonerMod  	= 1 + summonerMod;
			itemMod  		= 1 + itemMod;
			abilityMod  	= 1 + abilityMod;

			return summonerMod*itemMod*abilityMod-1;
	}
}

/**
 * Calculates the cumulative bonus modifier.
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
function calculateBonusModifier(statName, modifiers) {
	var bonus = 0;

	switch (statName) {
		default:
			for (var i = 0; i < modifiers.length; i++) {
				bonus += modifiers[i];
			}
			return bonus;
	}
}

/**
 * Calculates the cumulative modifier to be applied to the stat's base.
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
function calculateBaseModifier(statName, modifiers) {
	var bonus = 0;

	switch (statName) {
		default:
			for (var i = 0; i < modifiers.length; i++) {
				bonus += modifiers[i];
			}
			return bonus;
	}
}

/**
 * Calculates the cumulative modifier from all runes.
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
function calculateRunesModifier(statName, modifiers) {
	switch (statName) {
		case "movespeed":
			var bonus = 1;
			for (var i = 0; i < modifiers.length; i++) {
				bonus *= (1+modifiers[i]);
			}
			return bonus;
		default:
			var bonus = 0;
			for (var i = 0; i < modifiers.length; i++) {
				bonus += modifiers[i];
			}
			return bonus;
	}
}

/**
 * Calculates the cumulative modifier from all masteries.
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
function calculateMasteriesModifier(statName, modifiers) {
	switch (statName) {
		case "movespeed":
			var bonus = 1;
			for (var i = 0; i < modifiers.length; i++) {
				bonus *= (1+modifiers[i]);
			}
			return bonus;
		default:
			var bonus = 0;
			for (var i = 0; i < modifiers.length; i++) {
				bonus += modifiers[i];
			}
			return bonus;
	}
}

/**
 * Calculates the cumulative modifier from all items.
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
function calculateItemsModifier(statName, modifiers) {
	var bonus = 0;

	switch (statName) {
		default:
			for (var i = 0; i < modifiers.length; i++) {
				bonus += modifiers[i];
			}
			return bonus;
	}
}

/**
 * Calculates the cumulative modifier from all abilities.
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
function calculateAbilitiesModifier(statName, modifiers) {
	var bonus = 0;

	switch (statName) {
		default:
			for (var i = 0; i < modifiers.length; i++) {
				bonus += modifiers[i];
			}
			return bonus;
	}
}

/**
 * Calculates the flat bonus based on each dependency.
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
function calculateFlatBonus(dependencies, resStats) {
	var bonus = 0;

	var count = dependencies.length;
	for (var i = 0; i < count; i++) {
		var dep = dependencies[i];

		bonus += resStats[dep.name] * dep.coef;
	}
	return bonus;
}


/**
 * [isValidEffect description]
 * @param  {[type]}
 * @return {Boolean}
 */
function isValidEffect(effect) {
	return (("dest" in effect) && ("value" in effect) && ("type" in effect) &&
		("name" in effect) && ("src" in effect) && ("unique" in effect) &&
		("perlevel" in effect));
}

/**
 * Check if the data is well formated.
 * @param data {json} JSON containing champion information and effects.
 * @return {Array} Errors found.
 */
function validate(data) {
	var errors = [];

	if (!('level' in data)) {
		errors.push("Missing champion level!");
	}

	if (!('stats' in data)) {
		return "Missing base stats!";
	} else {
		if (!(data.stats instanceof Object)) {
			errors.push("Effects should be of type Object");
		} else {
			var stats = [
				'armor',
				'armorperlevel',
				'attackdamage',
				'attackdamageperlevel',
				'attackrange',
				'attackspeedoffset',
				'attackspeedperlevel',
				'crit',
				'critperlevel',
				'hp',
				'hpperlevel',
				'hpregen',
				'hpregenperlevel',
				'movespeed',
				'mp',
				'mpperlevel',
				'mpregen',
				'mpregenperlevel',
				'spellblock',
				'spellblockperlevel'];

			// check the structure of all the effects in the array
			for (var i = data.stats.length - 1; i >= 0; i--) {
				for (var k = stats.length - 1; k >= 0; k--) {
					if (!(stats[k] in data.stats[i])) {
						errors.push("Missing '" + stats[k] + "' stat!");
					}
				};
			};
		}
	}

	if (!('effects' in data)) {
		errors.push("Missing effects array!");
	} else {
		if (!(data.effects instanceof Array)) {
			errors.push("Effects should be of type Array");
		} else {
			var effectKeys = ['dest', 'value', 'type', 'unique', 'name', 'src', 'perlevel'];

			// check the structure of all the effects in the array
			for (var i = data.effects.length - 1; i >= 0; i--) {
				for (var k = effectKeys.length - 1; k >= 0; k--) {
					if (!(effectKeys[k] in data.effects[i])) {
						errors.push("Effect at " + i + " missing " + effectKeys[k] + " key!");
					}
				};
			};
		}
	}

	return errors;
}

/**
 * Given an array of effects, take max value for a named effect
 * @param  Object Array Effects
 * @param  String name Name of effect to get max value
 * @return value of effect
 */
function getHighestEffectValue(effects, name){

	var highest 	= 0.0;
	var effectCount = effects.length;

	for (var i = 0; i < effectCount; i++) {
		if (effects[i].name != name) continue;

		if (highest == 0 || effects[i].value > highest)
			highest = parseFloat(effects[i].value);
	}

	return highest;
}
