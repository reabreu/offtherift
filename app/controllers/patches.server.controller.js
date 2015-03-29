'use strict';

/**/
var _this 		= this;
var srcPatch    = '',
    destPatch   = '',
    version 	= '',
    copyTasks   = [],
	asyncTasks 	= [];

/**
 * Module dependencies.
 */
var mongoose 		= require('mongoose'),
	https 			= require('https'),
	errorHandler 	= require('./errors.server.controller'),
	Patch 			= mongoose.model('Patch'),
	Item 			= mongoose.model('Item'),
	Rune 			= mongoose.model('Rune'),
    Masterie        = mongoose.model('Masterie'),
	_ 				= require('lodash'),
	api 			= require('../../app/controllers/api.server.controller'),
	async			= require("async"),
    Champion        = mongoose.model('Champion'),
    users           = require('./users.server.controller');

/**
 * Create a Patch
 */
exports.create = function(req, res) {
	var patch = new Patch(req.body);
	patch.user = req.user;

	patch.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patch);
		}
	});
};

/**
 * Show the current Patch
 */
exports.read = function(req, res) {
	res.jsonp(req.patch);
};

/**
 * Update a Patch
 */
exports.update = function(req, res) {
	var patch = req.patch ;
	patch 	= _.extend(patch , req.body);

	patch.save(function(err) {

		if(version != '') return;

		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patch);
		}
	});
};

/**
 * List of Patches
 */
exports.list = function(req, res) {
    var query   = {};
	var skip 	= req.param('skip');
	var limit 	= req.param('limit');

	var options = {
		skip: skip,
		limit: limit
	}

    if (!res.isAdmin) {
        query.enabled = true;
        query.synched = true;
    }

	Patch.find(query,null,options).sort('-version').exec(function(err, patches) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patches);
		}
	});
};

/**
 * Patch middleware
 */
exports.patchByID = function(req, res, next, id) {
	Patch.findById(id).populate('user', 'displayName').exec(function(err, patch) {
		if (err) return next(err);
		if (! patch) return next(new Error('Failed to load Patch ' + id));
		req.patch = patch ;
		next();
	});
};

/**
* Patch middleware
*/
exports.patchByVersion = function(req, res, next, version) {
	Patch.find({ version: version }).exec(function(err, patch) {
		if (err) return next(err);
		if (!patch) return next(new Error('Failed to load patch ' + id));
		req.patch = patch[0];
		next();
	});
};

/**
 * Patch authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.patch.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.checkPatches = function(req,res){
	api.requestData(api.PATCH).then(function(apiRes) {

		if(apiRes.statusCode > 400){
    		inserted 	= -1;
    		updated 	= -1;
    		callback(null,{items: { inserted: inserted, updated: updated}});
    		return;
    	}

    	var patches_response 	= apiRes.data;
    	var options 			= { upsert: true, new: false };
    	var total 				= Object.keys(patches_response).length;
    	var inserted 			= 0;
    	var updated 			= 0;
    	var processed 			= 0;
    	var update 				= {
    		$setOnInsert: {
				created: new Date().toISOString()
			}
    	}

    	for (var i = 0; i < patches_response.length; i++) {
    		Patch.findOneAndUpdate({version: patches_response[i] }, update , options, function(err, doc){
    			if(doc === null){
    				++inserted;
    			}
    			else{
    				++updated;
    			}

    			++processed;

    			//when finished we call the callback function
    			if(total == processed){
    				res.jsonp({force: true,updated: updated, inserted: inserted});
    			}
    		});
    	}

	}, function(e) {
        console.log('Got error: ', e);
    });
}

//Metodo anonimo que sincroniza ITEMS
asyncTasks.push(function(callback){

	api.setParam('&itemListData=all&version=' + version);

    api.requestData(api.ITEM).then(function(apiRes) {
    	if(apiRes.statusCode > 400){
    		inserted 	= -1;
    		updated 	= -1;
    		callback(null,{items: { inserted: inserted, updated: updated}});
    		return;
    	}

    	var items 		= apiRes.data;
    	var options 	= { upsert: true, new: false };
    	var processed 	= 0;
    	var total 		= Object.keys(items.data).length;
    	var inserted 	= 0;
    	var updated 	= 0;

    	for (var key in items.data) {
    		//adicionar os nossos propios campos
    		items.data[key].version = version;
    		items.data[key].enabled = false;

			var conditions = {
				version: 	items.data[key].version,
				id: 		items.data[key].id
			}

    		Item.findOneAndUpdate( conditions, items.data[key], options, function(err, doc){

    			if(doc === null){
    				++inserted;
    			}
    			else{
    				++updated;
    			}

    			++processed;

    			//when finished we call the callback function
    			if(total == processed){
    				callback(null,{items: { inserted: inserted, updated: updated}});
    			}
    		});
    	}
    }, function(e) {
        console.log('Got error: ', e);
    });
});

//Metodo anonimo que sincroniza CHAMPIONS
asyncTasks.push(function(callback) {

    api.setParam('&champData=all&version=' + version);

    api.requestData(api.CHAMPION).then(function(apiRes) {

        // API ERROR
        if(apiRes.response.statusCode > 400){
            inserted    = -1;
            updated     = -1;
            callback(null, {champions: { inserted: inserted, updated: updated }});
            return;
        }

        var options       = { upsert: true, new: false };
        var champions     = apiRes.data.data       || {};
        var championsKeys = Object.keys(champions) || {};
        var total         = championsKeys.length   || 0;
        var inserted      = 0;
        var updated       = 0;
        var processed     = 0;

        // for all champions
        for (var i = 0; i < total; i++) {
            var champion = champions[championsKeys[i]];

            //adicionar os nosso propios campos
            champion = _.extend(champion, {
                version: version,
                created: new Date().toISOString(),
                enabled: false,
            });

            // update conditions
            var conditions = {
                version: version,
                id:      champion.id
            };


            //insert blank effect on skills
            for (var z = 0; z < champion.spells.length; z++) {
                champion.spells[z].customEffect = [];
            }

            Champion.findOneAndUpdate(conditions, champion, options, function(err, doc){
                if(doc === null){
                    ++inserted;
                }
                else{
                    ++updated;
                }

                ++processed;

                //when finished we call the callback function
                if(total == processed){
                    callback(null, {champions: { inserted: inserted, updated: updated }});
                }
            });
        }
    }, function(e) {
        console.log('Got error: ', e);
    });
});

//Metodo anonimo que sincroniza Runes
asyncTasks.push(function(callback){

	api.setParam('&runeListData=all&version=' + version);

    api.requestData(api.RUNE).then(function(apiRes) {
    	if(apiRes.statusCode > 400){
    		inserted 	= -1;
    		updated 	= -1;
    		callback(null,{runes: { inserted: inserted, updated: updated}});
    		return;
    	}

    	var runes 		= apiRes.data;
    	var options 	= { upsert: true, new: false };
    	var processed 	= 0;
    	var total 		= Object.keys(runes.data).length;
    	var inserted 	= 0;
    	var updated 	= 0;

    	for (var key in runes.data) {
    		//adicionar os nossos propios campos
    		runes.data[key].version = version;
    		runes.data[key].enabled = false;

			var conditions = {
				version: 	runes.data[key].version,
				id: 		runes.data[key].id
			}

    		Rune.findOneAndUpdate( conditions, runes.data[key], options, function(err, doc){

    			if(doc === null){
    				++inserted;
    			}
    			else{
    				++updated;
    			}

    			++processed;

    			//when finished we call the callback function
    			if(total == processed){
    				callback(null,{runes: { inserted: inserted, updated: updated}});
    			}
    		});
    	}
    }, function(e) {
        console.log('Got error: ', e);
    });
});

//Metodo anonimo que sincroniza Masteries
asyncTasks.push(function(callback){

    api.setParam('&masteryListData=all&all&version=' + version);

    api.requestData(api.MASTERIE).then(function(apiRes) {
        if(apiRes.statusCode > 400){
            inserted    = -1;
            updated     = -1;
            callback(null,{masteries: { inserted: inserted, updated: updated}});
            return;
        }

        var masteries   = apiRes.data;
        var options     = { upsert: true, new: false };
        var processed   = 0;
        var total       = Object.keys(masteries.data).length;
        var inserted    = 0;
        var updated     = 0;

        for (var key in masteries.data) {
            //adicionar os nossos propios campos
            masteries.data[key].version = version;
            masteries.data[key].enabled = false;

            var conditions = {
                version:    masteries.data[key].version,
                id:         masteries.data[key].id
            }

            Masterie.findOneAndUpdate( conditions, masteries.data[key], options, function(err, doc){

                if(doc === null){
                    ++inserted;
                }
                else{
                    ++updated;
                }

                ++processed;

                //when finished we call the callback function
                if(total == processed){
                    callback(null,{masteries: { inserted: inserted, updated: updated}});
                }
            });
        }
    }, function(e) {
        console.log('Got error: ', e);
    });
});

exports.syncPatchData = function(req, res){
	version = req.patch.version;
	//Efetuar os pedidos para os diferentes categorias (items/champions/etc) em paralelo
	async.parallel(asyncTasks, function(err,response){
		var send = {};

		//update patch info
		req.patch.synched 	= true;
		req.patch.update 	= new Date().toISOString();
		_this.update(req,res);

		//build report object
		for (var i = 0; i < response.length; i++) {
			for (var key in response[i]) {
				send[key] = response[i][key];
			}
		};

	  	// All tasks are done now
	  	res.jsonp({report: send});
	});
}

//Metodo anonimo que copia ITEMS
copyTasks.push(function(callback){

    Item.find({version: srcPatch },null,null).sort('name').exec(function(err, items) {
        var processed   = 0;
        var total       = items.length;
        var copied      = 0;

        for (var i = total - 1; i >= 0; i--) {
            //get item from dest version
            Item.findOneAndUpdate( {version: destPatch, id: items[i].id} , {customEffect: items[i].customEffect, enabled: items[i].enabled} , null, function(err,doc){
                if (doc !== null) {
                    ++copied;
                }

                ++processed;

                //when finished we call the callback function
                if(total == processed){
                    callback(null,{items: { copied: copied}});
                }
            });
        };
    });
});

//Metodo anonimo que copia Runes
copyTasks.push(function(callback){

    Rune.find({version: srcPatch },null,null).sort('name').exec(function(err, runes) {
        var processed   = 0;
        var total       = runes.length;
        var copied      = 0;

        for (var i = total - 1; i >= 0; i--) {
            //get item from dest version
            Rune.findOneAndUpdate( {version: destPatch, id: runes[i].id} , {customEffect: runes[i].customEffect, enabled: runes[i].enabled} , null, function(err,doc){
                if (doc !== null) {
                    ++copied;
                }

                ++processed;

                //when finished we call the callback function
                if(total == processed){
                    callback(null,{runes: { copied: copied}});
                }
            });
        };
    });
});

//Metodo anonimo que copia Masteries
copyTasks.push(function(callback){

    Masterie.find({version: srcPatch },null,null).sort('name').exec(function(err, masteries) {
        var processed   = 0;
        var total       = masteries.length;
        var copied      = 0;

        for (var i = total - 1; i >= 0; i--) {
            //get item from dest version
            Masterie.findOneAndUpdate( {version: destPatch, id: masteries[i].id} , {customEffect: masteries[i].customEffect, enabled: masteries[i].enabled} , null, function(err,doc){
                if (doc !== null) {
                    ++copied;
                }

                ++processed;

                //when finished we call the callback function
                if(total == processed){
                    callback(null,{masteries: { copied: copied}});
                }
            });
        };
    });
});

//Metodo anonimo que copia Champions
copyTasks.push(function(callback){

    Champion.find({version: srcPatch },null,null).sort('name').exec(function(err, champions) {
        var processed   = 0;
        var total       = champions.length;
        var copied      = 0;

        for (var i = total - 1; i >= 0; i--) {
            //get item from dest version
            Champion.findOneAndUpdate( {version: destPatch, id: champions[i].id} , {customEffect: champions[i].customEffect, enabled: champions[i].enabled} , null, function(err,doc){
                if (doc !== null) {
                    ++copied;
                }

                ++processed;

                //when finished we call the callback function
                if(total == processed){
                    callback(null,{champions: { copied: copied}});
                }
            });
        };
    });
});

//Copy effects from one patch to another
exports.copyPatch = function(req, res, next){
    srcPatch    = req.params.srcPatch;
    destPatch   = req.params.destPatch;

    //Efetuar os pedidos para os diferentes categorias (items/champions/etc) em paralelo
    async.parallel(copyTasks, function(err,response){
        var send = {};

        //build report object
        for (var i = 0; i < response.length; i++) {
            for (var key in response[i]) {
                send[key] = response[i][key];
            }
        };

        // All tasks are done now
        res.jsonp({report: send});
    });
}