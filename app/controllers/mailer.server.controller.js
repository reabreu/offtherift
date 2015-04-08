'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    config = require('../../config/config'),
    async = require('async'),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport');

/**
 * Send Email async
 * @param  {object}   options Email Options
 * @param  {Function} done    Async done callback
 */
exports.sendEmail = function (options, done) {
    /* var emailTransport = nodemailer.createTransport(smtpTransport(config.mailer.options)); // offtherift configuration
    var mailOptions = {
        to: options.email,
        from: config.mailer.from,
        subject: 'Invite',
        html: options.html,
        headers: {
            "Reply-To": 'info@offtherift.com',
        },
    }; */
    var emailTransport = nodemailer.createTransport(config.mailer.options); // gmail configuration
    var mailOptions    = {
        to: options.email,
        from: 'Paulo Caldeira <paulocaldeira17@gmail.com>',
        subject: 'Invite',
        text: 'Hello World',
        html: options.html,
    };
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