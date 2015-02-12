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
	
	var stats = {
		hp: {
			name: "hp",
			base: request.stats.hp + request.level * request.stats.hpperlevel,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
				runes: 			[],
				masteries : 	[],
				items: 			[],
				abilities: 		[]
			}
		},
		mp: {
			name: "mp",
			base: request.stats.mp + request.level * request.stats.mpperlevel,
			dependencies: [],
			modifiers: {
				flat: 			0.0,
				bonusmodifier: 	[],
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
		if ( !effect.unique  || (effect.unique && !uniques.contains(effect.name)) ) {
			if (effect.perlevel) {
				effect.value *= request.level;
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
	
	res.jsonp({stats: stats, response: response});
};

function calculateStatValue(stat, resStats) {
	var runesModifier		= calculateRunesModifier(stat.name, stat.modifiers.runes);
	var masteriesModifier 	= calculateMasteriesModifier(stat.name, stat.modifiers.masteries);
	var itemsModifier 		= calculateItemsModifier(stat.name, stat.modifiers.items);
	var abilitiesModifier	= calculateAbilitiesModifier(stat.name, stat.modifiers.abilities);
	var flatBonus			= calculateFlatBonus(stat.dependencies, resStats) + stat.modifiers.flat;
	var statModifier		= calculateModifier(stat.name, runesModifier, masteriesModifier, itemsModifier, abilitiesModifier);
	var bonusModifier		= calculateBonusModifier(stat.name, stat.modifiers.bonusmodifier);

	switch (stat.name) {
		case "hp":
		case "mp":
		default:
			return stat.base + (flatBonus + (stat.base + flatBonus) * statModifier) * (1 + bonusModifier);
	}
}

function calculateModifier(stat, runeMod, masteryMod, itemMod, abilityMod) {
	switch (stat.name) {
		case "hp":
		case "mp":
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
		case "hp":
		case "mp":
		default:
			for (var i = 0; i < modifiers; i++) {
				bonus += modifiers[i];
			}
			return bonus;
	}
}

function calculateRunesModifier(statName, modifiers) {
	var bonus = 0;

	switch (statName) {
		case "hp":
		case "mp":
		default:
			for (var i = 0; i < modifiers; i++) {
				bonus += modifiers[i];
			}
			return bonus;
	}
}

function calculateMasteriesModifier(statName, modifiers) {
	var bonus = 0;

	switch (statName) {
		case "hp":
		case "mp":
		default:
			for (var i = 0; i < modifiers; i++) {
				bonus += modifiers[i];
			}
			return bonus;
	}
}

function calculateItemsModifier(statName, modifiers) {
	var bonus = 0;

	switch (statName) {
		case "hp":
		case "mp":
		default:
			for (var i = 0; i < modifiers; i++) {
				bonus += modifiers[i];
			}
			return bonus;
	}
}

function calculateAbilitiesModifier(statName, modifiers) {
	var bonus = 0;

	switch (statName) {
		case "hp":
		case "mp":
		default:
			for (var i = 0; i < modifiers; i++) {
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

/**
 * [bonusMechanic description]
 * @param  {[type]}
 * @return {string} [additive, multiplicative]
 */
function bonusMechanic(stat) {
	switch (stat) {
		case "ap":
		case "":
			return "multiplicative";
		case "armor":
		case "attackspeed":
		case "attackdamage":
			return "additive";
	}
}
