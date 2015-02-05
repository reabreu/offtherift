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

    var attributes = null;

    if (req.param('name')) {
        attributes = _.extend({}, attributes, { name:  new RegExp('.*'+req.param('name')+'.*', 'i') });
    };

    console.log(attributes);

    var options = {
        skip:  req.param('skip')  || null,
        limit: req.param('limit') || null
    };

    Champion.find(attributes, null, options).sort('name').exec(function(err, champions) {
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

exports.checkChampions = function (req, res) {
    api.setParam('&champData=all');
    api.requestData(api.CHAMPION).then(function(apiRes) {

        // API ERROR
        if(apiRes.response.statusCode > 400){
            inserted    = -1;
            updated     = -1;
            callback(null, {items: { inserted: inserted, updated: updated}});
            return;
        }

        var version       = apiRes.data.version;
        var options       = { upsert: true, new: false };
        var champions     = apiRes.data.data       || {};
        var championsKeys = Object.keys(champions) || {};
        var version       = apiRes.data.version    || '';
        var total         = championsKeys.length   || 0;
        var inserted      = 0;
        var updated       = 0;
        var processed     = 0;
        var update        = {
            $setOnInsert: {
                created: new Date().toISOString()
            }
        }

        // for all champions
        for (var i = 0; i < total; i++) {
            var champion = champions[championsKeys[i]];

            // champion data
            champion = _.extend(champion, {
                version: version
            });

            Champion.findOneAndUpdate(champion, update, options, function(err, doc){
                if(doc === null){
                    ++inserted;
                }
                else{
                    ++updated;
                }

                ++processed;

                //when finished we call the callback function
                if(total == processed){
                    res.jsonp({force: true, updated: updated, inserted: inserted});
                }
            });
        }

    }, function(e) {
        console.log('Got error: ', e);
    });
}
