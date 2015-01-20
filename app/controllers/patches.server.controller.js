'use strict';

/**
 * Module dependencies.
 */
var mongoose 		= require('mongoose'),
	http 			= require('http'),
	errorHandler 	= require('./errors.server.controller'),
	Patch 			= mongoose.model('Patch'),
	_ 				= require('lodash'),
	api 			= require('../../app/controllers/api.server.controller');

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
 * Delete an Patch
 */
exports.delete = function(req, res) {
	var patch = req.patch ;

	patch.remove(function(err) {
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
	Patch.find({ version: '/'+version+'[\d\.]+/i' }).exec(function(err, patch) {
		if (err) return next(err);
		if (!patch) return next(new Error('Failed to load patch ' + id));
		req.patch = patch;
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
	var url = api.generateUrl(api.PATCH);
	http.get(url, function(res_api) {
	    var body = '';

	    res_api.on('data', function(chunk) {
	        body += chunk;
	    });

	    res_api.on('end', function() {
	    	var patches_response 	= JSON.parse(body);
	    	var options 			= { upsert: true};

	    	for (var i = 0; i < patches_response.length; i++) {
	    		Patch.findOneAndUpdate({version: patches_response[i] }, {} , {upsert:true}, function(err, doc){});
	    	}
	    	
	    	res.jsonp({force: true});

	    });
	}).on('error', function(e) {
	      console.log("Got error: ", e);
	});
}

exports.paginatePatches = function(req, res){
	console.log("aquiiii");
}