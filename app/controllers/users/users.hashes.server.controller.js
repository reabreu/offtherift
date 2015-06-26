'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    RegistrationHash = mongoose.model('RegistrationHash'),
    crypto = require('crypto'),
    config = require('../../../config/config'),
    async = require('async'),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    mailer = require('../mailer.server.controller'),
    _this = this;

/**
 * Returns all registration hashes
 */
exports.getRegistrationHashes = function(req, res, next) {

    var skip      = req.param('skip');
    var limit     = req.param('limit');
    var email     = req.param('email');
    var hash      = req.param('hash');
    var activated = req.param('activated');

    var options = {
        skip:       skip,
        limit:      limit
    };

    var query = {};

    if (typeof hash !== "undefined")
        query.hash = { "$regex": hash };

    if (typeof email !== "undefined")
        query.email = { "$regex": email, "$options": "i" };

    if (typeof activated !== "undefined" &&
        activated === "true")
        query.activated = { $exists: true };

    RegistrationHash.find(query, null, options).exec(function(err, hashes) {
        if (err) {
            res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(hashes);
        }
    });
};

/**
 * Returns one registration hash data
 */
exports.getRegistrationHash = function(req, res, next) {

    var hash = req.param('hash');

    RegistrationHash.findOne({ hash: { "$regex": hash } }, ['email', 'activated']).exec(function(err, hash) {
        if (err) {
            res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(hash);
        }
    });
};

/**
 * Validates a registration hash
 */
exports.generateRegistrationHashes = function (req, res, next) {

    var data  = {};

    var input  = req.param('input');
    var number = 1;

    if (input.match(/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/)) { // email
        var email = input;
    } else if (input.match(/\d+/)) { // number
        number = input;
    }

    // number
    if (number) {

        if (typeof email !== "undefined") {

            var data = _this.generateHashes(1, email);

            RegistrationHash.collection.insert(data, function (err, hashes) {
                if (err) {
                    res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json({
                        success: true,
                        message: 'Hash has been successfully created to ' + email + '.'
                    });
                }
            });

        } else {

            var query = {
                hash: { $exists: false }
            };

            async.waterfall([
                function (done) { // count existing users hashless
                    RegistrationHash.count(query, function (err, count){
                        if (err) {
                            res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        } else {
                            done(err, count);
                        }
                    });
                },
                function (usersHashLess, done) { // generate hashes for existing users

                    // generate right number or less
                    var userHashes = 0;
                    if (usersHashLess > 0) {
                        userHashes = number < usersHashLess ? number : usersHashLess;
                    }

                    var missing = number - userHashes;

                    // stores mailing list
                    var mailingList  = [];
                    if (userHashes > 0) {

                        var hashes = _this.generateHashes(userHashes);
                        var options = {
                            skip : 0, // Starting Row
                            limit: userHashes, // Ending Row
                            sort : {
                                created: 1 //Sort by Date Added ASC
                            }
                        };

                        RegistrationHash.find(query, null, options).exec(function (err, users){
                            if (err) {
                                res.status(400).send({
                                    message: errorHandler.getErrorMessage(err)
                                });
                            } else {
                                var userHashesAsync = [];

                                userHashesAsync.push(function(hDone) {
                                    hDone(null, []);
                                });

                                for (var i = 0; i < users.length; i++) {
                                    var userHash = users[i];

                                    // no more hashes (prevent)
                                    if (typeof hashes[i] === "undefined") {
                                        break;
                                    }

                                    userHash.hash = hashes[i].hash;

                                    userHashesAsync.push(function(mailingList, hDone) {
                                        userHash.save(function () {
                                            mailingList.push({
                                                email: userHash.email,
                                                hash : userHash.hash
                                            });
                                            hDone(null, mailingList);
                                        });
                                    });
                                }

                                userHashesAsync.push(function (mailingList, hDone) {

                                    // send mails
                                    for (var i = 0; i < mailingList.length; i++) {
                                        var mailOptions = {
                                            email: mailingList[i].email,
                                            hash: mailingList[i].hash
                                        };

                                        res.render('templates/invite-email', {
                                            email: mailOptions.email,
                                            appName: config.app.title,
                                            facebookLink: config.facebook.pageLink,
                                            twitterLink: config.twitter.pageLink,
                                            url: 'http://' + req.headers.host + '/account/activation/' + mailOptions.hash
                                        }, function(err, html) {

                                            mailer.sendEmail({
                                                email: mailOptions.email,
                                                subject: 'Confirmation',
                                                html: html
                                            });

                                        });
                                    }

                                    done(err, mailingList, missing);
                                });

                                async.waterfall(userHashesAsync);
                            }
                        });
                    } else {

                        done(null, mailingList, missing);

                    }

                },
                function (mailingList, missing, done) {
                    if (typeof missing !== "undefined" &&
                        missing > 0) {

                        RegistrationHash.collection.insert(_this.generateHashes(missing), function (err, hashes) {
                            if (err) {
                                res.status(400).send({
                                    message: errorHandler.getErrorMessage(err)
                                });
                            } else {
                                done(err, mailingList, missing);
                            }
                        });

                    } else {

                        done(null, mailingList, 0);

                    }
                },
                function (mailingList, missing, done) {
                    var message = missing + ' hashes created. ' + mailingList.length + ' appended to existing users.';

                    res.json({
                        success: true,
                        message: message,
                        mailingList: mailingList
                    });
                }
            ], function(err) {
                if (err) return next(err);
            });

        }
    };
};

/**
 * Activates a registration hash
 */
exports.activateRegistrationHash = function (req, res, next) {

    var hash  = req.param('hash') || null;

    RegistrationHash.findOne({
        hash : hash,
        email: { $exists: true }
    }, function(err, hash) {
        if (hash) {
            if (typeof hash.activated !== "undefined") { // already activated

                return res.redirect('/#!/account/activation/' + hash.hash + '?already=true');

            } else {

                hash.activated  = new Date();

                hash.save(function (err) {
                    return res.redirect('/#!/account/activation/' + hash.hash);
                });

            }

        } else {

            res.redirect('/');

        }

    });

};

/**
 * Verifies if exists unactivated registration hashes
 */
exports.hasUnsedHashes = function (req, res, next) {
    var query = {
        email: { $exists: false },
        activated: { $exists: false }
    };

    RegistrationHash.count(query).exec(function(err, count) {
        if (err) {
            res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json({ unactivated: count });
        }
    });
};

exports.countUnsetHashes = function (req, res, next) {
    var query = {
        hash: { $exists: false }
    };

    RegistrationHash.count(query).exec(function(err, count) {
        if (err) {
            res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json({ unactivated: count });
        }
    });
}

/**
 * Sends an email with login hash
 * @param  {string} to Email requested
 */
exports.subscribeEmail = function (req, res, next) {

    async.waterfall([
        function(done) {
            var email = req.param('email') || null;

            // correct and email
            if (email &&
                email.match(/.+\@.+\..+/)) {

                done(null, email);

            } else {
                res.status(400).send({
                    message: 'Invalid email.'
                });
            }
        },
        // Lookup email if is already registered
        function(email, done) {
            RegistrationHash.findOne({
                email: { $regex: email, $options: 'i' }
            }, function(err, hash) {
                if (!hash) {

                    done(err, email);

                } else { // email already registered

                    return res.json({
                        message: 'Your email is already registered.'
                    });

                }
            });
        },
        _this.emailHashRegistration(req, res, next),
        function (options, done) {
            done(null);

            return res.json({
                message: "Thank you for your registration. You'll be sent an activation email as soon as possible."
            });
        }
    ], function(err) {
        if (err) return next(err);
    });

};

/**
 * Get Access to strategy login
 * @param  {string}   strategy Strategy identifier (facebook or twitter)
 * @return {function}          Callback
 */
exports.getAccess = function (strategy) {

    var availableStrategies = ['facebook', 'twitter'];
    var strategyConfig      = require('../../../config/strategies/' + strategy);

    return function (req, res, next) {

        var hash = req.param('hash');

        if (_.indexOf(availableStrategies, strategy) > -1 &&
            typeof hash !== "undefined") {

            var envStrategyConfig = config[strategy];

            /**
             * Configure Social Callback
             */
            strategyConfig({ callbackURL: envStrategyConfig.callbackURL + '/' + hash });

            RegistrationHash.findOne({
                hash: hash
            }, function(err, hash) {
                if (!hash) {

                    res.status(400).send({
                        message: "You don't have rights to log or create an account."
                    });

                } else {

                    next();

                }

            });

        } else { // other strategy

            res.status(400).send({
                message: "You are allowed to login only using Facebook and Twitter accounts."
            });

        }

    };

};

/**
 * Removes registration key
 * @param  {object}   req  Request
 * @param  {object}   res  Response
 * @param  {Function} next Next callback
 * @return {object}        Response
 */
exports.removeRegistrationHash = function (req, res, next) {

    var id = req.param('id') || false;

    RegistrationHash.findOneAndRemove({ _id: id }, function(err) {
        if (!err) {
            res.json({
                success: true,
                message: 'Hash has been successfully removed.'
            });
        } else {
            res.json({
                success: false,
                message: 'Invalid Hash.'
            });
        }
    });

};



/**
 * Generate Random Hashes
 * @param  {integer} number Number of Hashes
 * @param  {string}  email  Email
 * @return {Array}          Hashes
 */
exports.generateHashes = function (number, email) {
    var hashes = [], data;

    for (var i = number - 1; i >= 0; i--) {
        data = {};

        var current_date = (new Date()).valueOf().toString();
        var random       = Math.random().toString();
        var hash         = crypto.createHash('sha1').update(current_date + random).digest('hex');

        data.hash = hash;

        if (email) {
            data.email = email;
        }

        hashes.push(data);

    }

    return hashes;
};

/**
 * Regists an email with a hash (used on async.waterfall)
 * @param  {object}   req  Request Object
 * @param  {object}   res  Response Object
 * @param  {function} next Function
 */
exports.emailHashRegistration = function(req, res, next) {
    /**
     * Regists an email with a hash (used on async.waterfall)
     * @param  {string}   email User Email
     * @param  {Function} done  Async done callback
     */
    return function (email, done) {
        RegistrationHash.findOne({
            email: { $exists: false },
            activated: { $exists: false }
        }, function(err, hash) {
            if (!hash) {
                var newHash = new RegistrationHash({ email: email });

                newHash.save(function (err) {
                    done(err, {});
                });

            } else {
                hash.email = email;

                hash.save(function(err) {
                    if (err) {
                        res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {

                        // sends activation email
                        async.waterfall([
                            function(aDone) {
                                res.render('templates/invite-email', {
                                    email: email,
                                    appName: config.app.title,
                                    facebookLink: config.facebook.pageLink,
                                    twitterLink: config.twitter.pageLink,
                                    url: 'http://' + req.headers.host + '/account/activation/' + hash.hash
                                }, function(err, html) {

                                    aDone(err, {
                                        email: email,
                                        subject: 'Confirmation',
                                        html : html
                                    });

                                });
                            },
                            mailer.sendEmailAsync,
                            function (response, done) {
                                done(err, {});
                            }
                        ], function(err) {
                            if (err) return next(err);
                        });
                        done(err, {});
                    }
                });
            }
        });
    };
};
