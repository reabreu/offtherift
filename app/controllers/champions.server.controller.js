'use strict';

/**
 * Module dependencies.
 */
var mongoose        = require('mongoose'),
    errorHandler    = require('./errors.server.controller'),
    Champion        = mongoose.model('Champion'),
    http            = require('http'),
    _               = require('lodash'),
    api             = require('../../app/controllers/api.server.controller'),
    async           = require("async");

/**
 * Create a Champion
 */
exports.create = function(req, res) {
    var champion = new Champion(req.body);
    champion.user = req.user;

    champion.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(champion);
        }
    });
};

/**
 * Show the current Champion
 */
exports.read = function(req, res) {
    res.jsonp(req.champion);
};

/**
 * Update a Champion
 */
exports.update = function(req, res) {
    var champion = req.champion ;

    champion = _.extend(champion , req.body);

    champion.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(champion);
        }
    });
};

/**
 * Delete an Champion
 */
exports.delete = function(req, res) {
    var champion = req.champion ;

    champion.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(champion);
        }
    });
};

/**
 * List of Champions
 */
exports.list = function(req, res) {
    var skip        = req.param('skip');
    var limit       = req.param('limit');
    var version     = req.param('version');
    var name        = req.param('name');
    var enabled     = req.param('enabled');
    var riotId      = req.param('riotId');
    var build       = req.param('build');
    var data        = req.param('data');
    var select      = '';
    var query       = {};

    var options = {
        skip:       skip,
        limit:      limit
    }

    if (!res.isAdmin) {
        query.enabled = true;
    }

    if (build) {
        select = 'id key title image name version';
    }

    if (data) {
        select = 'id key title image stats name version';
    }

    if( version != undefined && version != '')
        query.version = version;

    if( name != undefined)
        query.name = { "$regex": name, "$options": "i" };

    if( enabled != undefined)
        query.enabled = enabled;

    if( riotId != undefined)
        query.id = riotId;

    Champion.find(query, select, options).sort('name').exec(function(err, champions) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(champions);
        }
    });
};

/**
 * Champion middleware
 */
exports.championByID = function(req, res, next, id) {
    Champion.findById(id).populate('user', 'displayName').exec(function(err, champion) {
        if (err) return next(err);
        if (! champion) return next(new Error('Failed to load Champion ' + id));
        req.champion = champion ;
        next();
    });
};

/**
 * Champion authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.champion.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};