'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Build = mongoose.model('Build'),
    Champion   = mongoose.model('Champion'),
    http = require('http'),
    async   = require("async"),
	_ = require('lodash');

/**
 * Create a Build
 */
exports.create = function(req, res) {
	var build           = new Build(req.body);
	build.user 			= req.user;
	build.displayName 	= req.user.displayName;

	build.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(build);
		}
	});
};

/**
 * Show the current Build
 */
exports.read = function(req, res) {
    var build = req.build;
    build.view_count++;

    build.save();

    var now = new Date();
    var updateDate = new Date(build.lastFacebookUpdate);
    updateDate.setMinutes(updateDate.getMinutes() + 5);

    // Check if an update is needed
    if (updateDate <= now || res.isAdmin) {
        // Url from which we pretend to extract the like/share/comment count
        var url = res.locals.url;

        var facebookApi = 'http://api.facebook.com/method/links.getStats?urls=' + url.replace("/builds", "/%23!/builds")+ '&format=json';

        // Get facebook counts for the current build.
        http.get(facebookApi, function(info) {
            var body = "";

            info.on('data', function (chunk) {
                body += chunk;
            });

            info.on('end', function () {
                body = JSON.parse(body)[0];

                // Only update if we have valid facebook info.
                if (body &&
                    "share_count" in body &&
                    "like_count" in body &&
                    "comment_count" in body &&
                    "commentsbox_count" in body) {

                    // update build information
                    build.facebook.share_count   = body.share_count;
                    build.facebook.like_count    = body.like_count;
                    build.facebook.comment_count = body.comment_count + body.commentsbox_count;
                    build.lastFacebookUpdate     = now;

                    saveAndReturn(res, build);
                }
				else {
					res.jsonp({data: build});
				}
            });
        }).on('error', function(err) {
            console.log( err.message);
        });
    } else {
		res.jsonp({data: build});
    }
};

function saveAndReturn(res, build) {
    build.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
    });
    res.jsonp({data: build});
}

/**
 * Update a Build
 */
exports.update = function(req, res) {
	var build = req.build ;

	build = _.extend(build , req.body);

	build.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(build);
		}
	});
};

/**
 * Delete an Build
 */
exports.delete = function(req, res) {
	var build = req.build ;

	build.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(build);
		}
	});
};

/**
 * List of Builds
 */
exports.list = function(req, res) {
	var version 	= req.param('version');
	var champion_id = req.param('champion_id');
	var group 		= req.param('group');
	var author 		= req.param('author');
	var skip 		= req.param('skip');
	var limit 		= req.param('limit');
	var query 		= {};

	var options 	= {
		skip: 		skip,
		limit: 		limit
	};

	//displayName
	var populateQuery       = [{path:'user', select:'displayName'}, {path:'champion', select:'name'}];

	if(version != undefined && version != "")
		query.version = version;

	if(champion_id != undefined && champion_id != "")
		query.champion_id = champion_id;

	if(group == "mine" && typeof(req.user) !== 'undefined'){
	 	query.user = req.user._id;
	}

	else if (group == "public"){
		//query.user 		= { "$ne" : req.user._id };
		query.visible 	= true;

		if (author != undefined && author != ""){
			query.displayName = {"$regex": author};
		}
	}

	Build.find(query,null,options).sort('-created').populate(populateQuery).exec(function(err, builds) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(builds);
		}
	});
};

/**
 * Build middleware
 */
exports.buildByID = function(req, res, next, id) {

    var populateQuery       = [{path:'user', select:'displayName'}, {path:'champion', select:'name image title version partype'}];

	Build.findById(id).populate(populateQuery).exec(function(err, build) {
		if (err) return next(err);
		if (! build) return next(new Error('Failed to load Build ' + id));
		req.build = build ;
		next();
	});
};

/**
 * Build authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.build.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


exports.getTotalStats = function(req,res,next){
    Build.aggregate(
        [
            {
                $match : { user : req.user._id }
            },
            {
                $group: {
                    _id: "$user",
                    build_count: {$sum: 1},
                    like_count: {$sum: "$facebook.like_count"},
                    comment_count: {$sum: "$facebook.comment_count"},
                    share_count: {$sum: "$facebook.share_count"},
                    view_count: {$sum: "$view_count"}
                }
            }
        ],
        function(err,result) {
            if(result == 0){
                result = [{
                    build_count: 0,
                    like_count: 0,
                    comment_count: 0,
                    share_count: 0,
                    view_count: 0
                }];
            }
            res.jsonp(result);
        }
    );
};

exports.getPopularBuilds = function(req,res,next){
    //buscar data da ultima build
    Build.findOne().sort('-created').exec(function(err, build) {

        var nd          = calculateMinimunDate(build.created, days);
        var days        = req.param('days');
        var limit       = req.param('limit');

        if(limit == undefined || limit == "")
            limit = 5;

        if(days == undefined || days == "")
            days = 7;

        Build.aggregate(
            [
                {
                    $match : { created : {$gte: nd}, visible: true }
                },
                {
                    $project: {
                        facebook: {
                            comment_count   : "$facebook.comment_count",
                            share_count     : "$facebook.share_count",
                            like_count     : "$facebook.like_count"
                        },
                        champion: "$champion",
                        displayName: "$displayName",
                        name: "$name",
                        version: "$version",
                        view_count: "$view_count",
                        totalFb : { '$add' : [ "$facebook.comment_count", "$facebook.share_count", "$facebook.like_count" ] }
                    }
                },
                {
                    $sort : {totalFb: -1}
                },
                {   $limit : 15 }
            ],
            function(err,result) {
               buildStatisticsChampionArray(res, result);
            }
        );
    });
};

exports.getMostmostCommentedBuilds = function(req,res,next){
    Build.findOne().sort('-created').exec(function(err, build) {
        var nd          = calculateMinimunDate(build.created, days);
        var days        = req.param('days');
        var limit       = req.param('limit');

        if(limit == undefined || limit == "")
            limit = 5;

        if(days == undefined || days == "")
            days = 7;

        Build.aggregate(
            [
                {
                    $match : { created : {$gte: nd}, visible: true }
                },
                {
                    $project: {
                        facebook: {
                            comment_count   : "$facebook.comment_count",
                            share_count     : "$facebook.share_count",
                            like_count     : "$facebook.like_count"
                        },
                        champion: "$champion",
                        displayName: "$displayName",
                        name: "$name",
                        version: "$version",
                        view_count: "$view_count",
                        totalFbComments : { '$add' : [ "$facebook.comment_count"] }
                    }
                },
                {
                    $sort : {totalFbComments: -1}
                },
                {   $limit : 15 }
            ],
            function(err,result) {
                buildStatisticsChampionArray(res, result);
            }
        );
    });
};

exports.getMostmostSharedBuilds = function(req,res,next){
    Build.findOne().sort('-created').exec(function(err, build) {
        var nd          = calculateMinimunDate(build.created, days);
        var days        = req.param('days');
        var limit       = req.param('limit');

        if(limit == undefined || limit == "")
            limit = 5;

        if(days == undefined || days == "")
            days = 7;

        Build.aggregate(
            [
                {
                    $match : { created : {$gte: nd}, visible: true }
                },
                {
                    $project: {
                        facebook: {
                            comment_count   : "$facebook.comment_count",
                            share_count     : "$facebook.share_count",
                            like_count     : "$facebook.like_count"
                        },
                        champion: "$champion",
                        displayName: "$displayName",
                        name: "$name",
                        version: "$version",
                        view_count: "$view_count",
                        totalFbComments : { '$add' : [ "$facebook.share_count"] }
                    }
                },
                {
                    $sort : {totalFbComments: -1}
                },
                {   $limit : 15 }
            ],
            function(err,result) {
                buildStatisticsChampionArray(res, result);
            }
        );
    });
};

exports.countBuilds = function(req,res,next){
    Build.count({}, function( err, count){
        res.jsonp({num:count});
    })
}

exports.getMostmostLikedBuilds = function(req,res,next){
    Build.findOne().sort('-created').exec(function(err, build) {
        var nd          = calculateMinimunDate(build.created, days);
        var days        = req.param('days');
        var limit       = req.param('limit');

        if(limit == undefined || limit == "")
            limit = 5;

        if(days == undefined || days == "")
            days = 7;

        Build.aggregate(
            [
                {
                    $match : { created : {$gte: nd}, visible: true }
                },
                {
                    $project: {
                        facebook: {
                            comment_count   : "$facebook.comment_count",
                            share_count     : "$facebook.share_count",
                            like_count     : "$facebook.like_count"
                        },
                        champion: "$champion",
                        displayName: "$displayName",
                        name: "$name",
                        version: "$version",
                        view_count: "$view_count",
                        totalFbComments : { '$add' : [ "$facebook.like_count"] }
                    }
                },
                {
                    $sort : {totalFbComments: -1}
                },
                {   $limit : 15 }
            ],
            function(err,result) {
                buildStatisticsChampionArray(res, result);
            }
        );
    });
};

function calculateMinimunDate(lastBuildDate, days){
    var nd;

    if( lastBuildDate != null){
        var lastBuildDate   = new Date(lastBuildDate);
        var limitDate       = new Date(lastBuildDate);

        limitDate.setDate(limitDate.getDate() - days); // minus the date

        nd = new Date(limitDate);
    } else{
        nd = new Date();
    }
    return nd;
}

function buildStatisticsChampionArray(res, result ){
    if(result.length == 0)
        return res.jsonp([]);

    var lastUpdatedIndex = result.length-1;

    var getPopularChampion = function(result, callback) {
        Champion.findOne({_id: result[lastUpdatedIndex].champion}).exec(function(err, champion) {
            result[lastUpdatedIndex].champion = { name : champion.name };
            lastUpdatedIndex--;

            callback(null, result);
        });
    };

    var pop = [function(callback) {
        Champion.findOne({_id: result[lastUpdatedIndex].champion}).exec(function(err, champion) {
            result[lastUpdatedIndex].champion = { name : champion.name };
            lastUpdatedIndex--;

            callback(null,result);
        });
    }];

    for (var i = 0; i < result.length - 1; i++) {
        pop.push(getPopularChampion);
    }

    async.waterfall(pop, function (err,result) {
        res.jsonp({data:result});
    });
}