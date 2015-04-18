'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Build = mongoose.model('Build'),
    http = require('http'),
	_ = require('lodash');

/**
 * Create a Build
 */
exports.create = function(req, res) {
	var build = new Build(req.body);
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

    var now = new Date();
    var updateDate = new Date(build.lastFacebookUpdate);
    updateDate.setMinutes(updateDate.getMinutes() + 5);

    // Check if an update is needed
    if (updateDate <= now) {
        // Url from which we pretend to extract the like/share/comment count
        var url = res.locals.url;

        var facebookApi = 'http://api.facebook.com/method/links.getStats?urls=' + url + '&format=json';

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
                    "comment_count" in body) {

                    // update build information
                    build.facebook.share_count   = body.share_count;
                    build.facebook.like_count    = body.like_count;
                    build.facebook.comment_count = body.comment_count;
                    build.lastFacebookUpdate     = now;

                    saveAndReturn(res, build);
                }
            });
        }).on('error', function(err) {
            console.log( err.message);
        });
    } else {
        saveAndReturn(res, build);
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
	}

	//displayName
	var populateQuery = [{path:'user', select:'displayName'}];

	if(version != undefined && version != "")
		query.version = version;

	if(champion_id != undefined && champion_id != "")
		query.champion_id = champion_id;

	if(group == "mine"){
	 	query.user = req.user._id;
	}
	else if (group == "public"){
		query.user 		= { "$ne" : req.user._id };
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
	Build.findById(id).populate('user', 'displayName').exec(function(err, build) {
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
