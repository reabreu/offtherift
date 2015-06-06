'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    config = require('../../config/config'),
    async = require('async'),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    _this = this;

/**
 * Send Email async
 * @param  {object}   options Email Options
 * @param  {Function} done    Async done callback
 */
exports.sendEmailAsync = function (options, done) {
    var emailTransport = _this.getTransporter();
    var mailOptions    = _this.parseEmailOptions(options);

    emailTransport.sendMail(mailOptions, function(err, info) {
        if (!err) {
            return done(err, {
                success: true,
                options: options,
            });
        }

        done(err, {
            success: false,
            options: options,
        });
    });
};

/**
 * Send Email sync
 * @param  {object} options Email Options
 */
exports.sendEmail = function (options) {
    var emailTransport = _this.getTransporter();
    var mailOptions    = _this.parseEmailOptions(options);

    emailTransport.sendMail(mailOptions);
};

/**
 * Parse all mail options
 * @param {object} options Email Options
 */
exports.parseEmailOptions = function (options) {

    // offtherift configuration
    var emailTransport = _this.getTransporter();
    var mailOptions    = {
        to: options.email,
        from: config.mailer.from,
        subject: options.subject || 'OffTheRift',
        html: options.html
    };

    // gmail configuration
    /*var emailTransport = nodemailer.createTransport(config.mailer.options);
    var mailOptions    = {
        to: options.email,
        from: 'Paulo Caldeira <paulocaldeira17@gmail.com>',
        subject: 'Invite',
        text: 'Hello World',
        html: options.html,
    };*/

    return mailOptions;
};

/**
 * Get Transporter
 * @param {object} options Email Options
 */
exports.getTransporter = function (options) {
    return nodemailer.createTransport(smtpTransport(config.mailer.options));
};