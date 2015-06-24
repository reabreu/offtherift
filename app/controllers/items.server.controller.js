'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Item = mongoose.model('Item'),
	_ = require('lodash');

/**
 * Create a Item
 */
exports.create = function(req, res) {
	var item = new Item(req.body);
	item.user = req.user;

	item.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(item);
		}
	});
};

/**
 * Show the current Item
 */
exports.read = function(req, res) {
	res.jsonp(req.item);
};

/**
 * Update a Item
 */
exports.update = function(req, res) {

	var item = req.item ;

	item = _.extend(item , req.body);

	item.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(item);
		}
	});
};

/**
 * Delete an Item
 */
exports.delete = function(req, res) {
	var item = req.item ;

	item.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(item);
		}
	});
};

/**
 * List of Items
 */
exports.list = function(req, res) {
	var skip 		= req.param('skip');
	var limit 		= req.param('limit');
	var version 	= req.param('version');
	var name 		= req.param('name');
	var enabled 	= req.param('enabled');
	var riotId 		= req.param('riotId');
	var build 		= req.param('build');
	var select 		= '';

	var options = {
		skip: 		skip,
		limit: 		limit
	};

	var query = {};

	if (!res.isAdmin) {
        query.enabled = true;
    }

    if(build){
    	select = 'id name image version description plaintext gold customEffect requiredChampion tags';
	}

	if(version != undefined && version != '')
		query.version = version;

	if(name != undefined)
		query.name = { "$regex": name, "$options": "i" };

	if(enabled != undefined)
		query.enabled = enabled;

	if (riotId != undefined) {
		if (_.isArray(riotId)) {
    		query.id = { "$in": riotId };
		} else {
    		query.id = riotId;
		}
	}

	Item.find(query,select,options).sort('name').exec(function(err, items) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(items);
		}
	});
};

/**
 * Item middleware
 */
exports.itemByID = function(req, res, next, id) {
	Item.findById(id).populate('user', 'displayName').exec(function(err, item) {
		if (err) return next(err);
		if (! item) return next(new Error('Failed to load Item ' + id));
		req.item = item ;
		next();
	});
};

/**
 * Item authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.item.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
