'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');

exports.calculate = function(req, res) {
	res.jsonp(module.exports.processStats(req.body));
}

/**
 * Calculate
 */
exports.processStats = function(request) {

	// @TODO Validate request
	
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

	// Structure of the stats with all the necessary components to
	// calculate each stat's value
	var stats = {
		hp: {
			name: "hp",
			base: request.stats.hp + growth[request.level] * request.stats.hpperlevel,
			dependencies: [], // {name: source, coef: percentValue}
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[]
			}
		},
		mp: {
			name: "mp",
			base: request.stats.mp + growth[request.level] * request.stats.mpperlevel,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[]
			}
		},
		hpregen: {
			name: "hpregen",
			base: request.stats.hpregen + growth[request.level] * request.stats.hpregenperlevel,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[]
			}
		},
		mpregen: {
			name: "mpregen",
			base: request.stats.mpregen + growth[request.level] * request.stats.mpregenperlevel,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[]
			}
		},
		attackdamage: {
			name: "attackdamage",
			base: request.stats.attackdamage + growth[request.level] * request.stats.attackdamageperlevel,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[]
			}
		},
		abilitypower: {
			name: "abilitypower",
			base: 0,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[]
			}
		},
		armorpenetration: {
			name: "armorpenetration",
			base: 0,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[]
			}
		},
		magicpenetration: {
			name: "magicpenetration",
			base: 0,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[]
			}
		},
		lifesteal: {
			name: "lifesteal",
			base: 0,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[]
			}
		},
		spellvamp: {
			name: "spellvamp",
			base: 0,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[]
			}
		},
		attackspeed: {
			name: "attackspeed",
			base: 0.625 / (1 + request.stats.attackspeedoffset),
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[growth[request.level] * request.stats.attackspeedperlevel]
			}
		},
		cooldownreduction: {
			name: "cooldownreduction",
			base: 0,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[]
			}
		},
		critchance: {
			name: "critchance",
			base: 0,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[]
			}
		},
		armor: {
			name: "armor",
			base: request.stats.armor + growth[request.level] * request.stats.armorperlevel,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[]
			}
		},
		attackrange: {
			name: "attackrange",
			base: request.stats.attackrange,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[]
			}
		},
		spellblock: {
			name: "spellblock",
			base: request.stats.spellblock + growth[request.level] * request.stats.spellblockperlevel,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[]
			}
		},
		movespeed: {
			name: "movespeed",
			base: request.stats.movespeed,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[]
			}
		},
		tenacity: {
			name: "tenacity",
			base: 0,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				basemodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[]
			}
		}
	};

	// List containing all the unique names found.
	var uniques = [];

	// Apply flat effect, store percent modifiers and get effects with dependencies.
	var effectCount = request.effects.length;
	for (var i = 0; i < effectCount; i++) {
		var effect = request.effects[i];

		// If the effect has dependencies, save it for later.
		if (effect.src != "") {
			stats[effect.dest].dependencies.push({name: effect.src, coef: effect.value});
			continue;
		}

		// Add flat bonus from normal or unprocessed uniques.
		if ( !effect.unique  || (effect.unique && (uniques.indexOf(effect.name)) == -1) ) {
			// If the value is applied per level, set value to appropriate level.
			if (effect.perlevel) {
				effect.value *= request.level;
			}

			// "Move" the effect's value to the correct place.
			if (effect.type === "flat") {
				stats[effect.dest].modifiers.flat += effect.value;
			}
			else {
				stats[effect.dest].modifiers[effect.type].push(effect.value);
			}

			if (effect.unique) uniques.push(effect.name);
		}
	}

	var response = {};

	// Calculate independent stats first.
	for (var key in stats) {
		var stat = stats[key];

		if (stat.dependencies.length) continue; // skip dependencies

		response[stat.name] = calculateStatValue(stat, response);
	}

	// Calculate dependent stats.
	for (var key in stats) {
		var stat = stats[key];

		if (!stat.dependencies.length) continue; // skip independent stats

		response[stat.name] = calculateStatValue(stat, response);
	}
	
	// Format stats according to the in-game stats window.
	for (var key in response) {
		switch (key) {
			case "hp":
				response[key] = Math.ceil(response[key]);
				break;
			case "mp":
				response[key] = Math.floor(response[key]);
				break;
			case "attackspeed":
				response[key] = Math.min(response[key], 2.5);
				response[key] = parseFloat(response[key].toFixed(2));
				break;
			case "cooldownreduction":
				response[key] = Math.min(response[key], 40);
				response[key] = parseFloat(response[key].toFixed(2));
				break;
			case "critchance":
				response[key] = Math.min(response[key], 100);
				response[key] = Math.round(response[key]);
				break;
			case "movespeed":
				var secondCap = Math.max((response[key] - 490), 0) * 0.5;
				var firstCap  = (Math.max(Math.min(response[key] - 490, 415) - 415), 0) * 0.8;
				response[key] = secondCap + firstCap + Math.min(response[key], 415);
				break;
			case "armorpenetration":
			case "magicpenetration":
				break;
			default:
				response[key] = Math.round(response[key]);
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
	
	var converted = statModifier.toFixed(3);
	statModifier = parseFloat(converted);

	switch (stat.name) {
		case "tenacity":
			return statModifier;
		case "attackspeed":
			return stat.base * (1 + statModifier);
		case "armorpenetration":
		case "magicpenetration":
			return [flatBonus, statModifier];
		default:
			var baseCoef 	= stat.base*baseModifier;
			var maxStat		= stat.base + baseCoef + flatBonus; // @TODO: Check if baseCoef affects maxStat
			var statBonus 	= baseCoef + flatBonus + maxStat * statModifier;
			
			// DEBUG
			//console.log(stat.name + "\nstatModifier : " + statModifier + "\nmaxStat : " + maxStat);
			
			// if (stat.name === "abilitypower")
			// 	console.log(stat);
			return stat.base + statBonus * (1 + bonusModifier);
	}
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
 * @return {[type]}
 * 				Cumulative modifier for the given stat.
 */
function calculateModifier(stat, runeMod, masteryMod, itemMod, abilityMod) {
	switch (stat) {
		case "attackdamage": // stacks additively between sources
		case "attackspeed":
		case "cooldownreduction":
		case "critchance":
			return runeMod + masteryMod + itemMod + abilityMod;
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
 * Calculates the cumulative modifier from all masteries.
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
function calculateMasteriesModifier(statName, modifiers) {
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
 * Calculates the cumulative modifier from all items.
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
function calculateItemsModifier(statName, modifiers) {
	var bonus = 0;

	switch (statName) {
		case "tenacity":
			bonus = 1;
			for (var i = 0; i < modifiers.length; i++) {
				bonus *= (1 + modifiers[i]);
			}
			return (bonus - 1);
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
