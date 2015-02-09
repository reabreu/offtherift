'use strict';

/**/
var _this 		= this;
var version 	= '',
	asyncTasks 	= [];

/**
 * Module dependencies.
 */
var mongoose 		= require('mongoose'),
	https 			= require('https'),
	errorHandler 	= require('./errors.server.controller'),
	Patch 			= mongoose.model('Patch'),
	Item 			= mongoose.model('Item'),
	_ 				= require('lodash'),
	api 			= require('../../app/controllers/api.server.controller'),
	async			= require("async");

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
	
	var skip 	= req.param('skip');
	var limit 	= req.param('limit');

	var options = {
		skip: skip,
		limit: limit
	}

	Patch.find(null,null,options).sort('-version').populate('user', 'displayName').exec(function(err, patches) {
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