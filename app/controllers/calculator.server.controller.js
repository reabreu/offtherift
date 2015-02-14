'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');

/**
 * Calculate
 */
exports.processStats = function(req, res) {
	var request = req.body;

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
	}

	var stats = {
		hp: {
			name: "hp",
			base: request.stats.hp + growth[request.level] * request.stats.hpperlevel,
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
		}
	};

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
			if (effect.perlevel) {
				effect.value *= request.level;
				console.log(effect.value);
			}

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
	
	res.jsonp({response: response, stats: stats});
};

function calculateStatValue(stat, resStats) {
	var runesModifier		= calculateRunesModifier(stat.name, stat.modifiers.runes);
	var masteriesModifier 	= calculateMasteriesModifier(stat.name, stat.modifiers.masteries);
	var itemsModifier 		= calculateItemsModifier(stat.name, stat.modifiers.items);
	var abilitiesModifier	= calculateAbilitiesModifier(stat.name, stat.modifiers.abilities);
	var flatBonus			= calculateFlatBonus(stat.dependencies, resStats) + stat.modifiers.flat;
	var statModifier		= calculateModifier(stat.name, runesModifier, masteriesModifier, itemsModifier, abilitiesModifier);
	var bonusModifier		= calculateBonusModifier(stat.name, stat.modifiers.bonusmodifier);
	var baseModifier 		= calculateBaseModifier(stat.name, stat.modifiers.basemodifier);
	console.log(baseModifier);
	switch (stat.name) {
		default:
			var baseCoef 	= stat.base*baseModifier;
			var maxStat		= stat.base + baseCoef + flatBonus; // @TODO: Check if baseCoef affects maxStat
			var statBonus 	= baseCoef + flatBonus + maxStat * statModifier;
			return stat.base + statBonus * (1 + bonusModifier);
	}
}

function calculateModifier(stat, runeMod, masteryMod, itemMod, abilityMod) {
	switch (stat.name) {
		case "attackdamage": // stacks additively between sources
			return runeMod + masteryMod + itemMod + abilityMod;
		default:
			var summonerMod = runeMod + masteryMod;

			if ((summonerMod == 0) && (itemMod == 0) && (abilityMod == 0)) {
				return 0;
			}

			summonerMod  	= (summonerMod == 0) 	? 1 : summonerMod;
			itemMod  		= (itemMod == 0) 		? 1 : itemMod;
			abilityMod  	= (abilityMod == 0) 	? 1 : abilityMod;

			return summonerMod*itemMod*abilityMod;
	}
}

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
