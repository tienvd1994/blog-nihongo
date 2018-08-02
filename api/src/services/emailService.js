"use strict";

const nodemailer = require('nodemailer');
const config = require('../../config');
const Email = require('email-templates');
const Q = require("q");
const errors = require('restify-errors');

const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.secure, // true for 465, false for other ports
    auth: {
        user: config.mail.credentials.user, // generated ethereal user
        pass: config.mail.credentials.pass // generated ethereal password
    }
});


/**
 * Send email to address with plain text body
 *
 * @param from
 * @param to
 * @param subject
 * @param body
 */
function sendPlainText(from, to, subject, body) {
    let mailOptions = {
        from: from || config.email.from, // sender address
        to: to,
        subject: subject,
        text: body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });
}

/**
 * Send email with HTML format
 *
 * @param from
 * @param to
 * @param subject
 * @param body
 */
function sendHtml(from, to, subject, body) {
    let mailOptions = {
        from: from || config.email.from, // sender address
        to: to,
        subject: subject,
        html: body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });
}

/**
 *
 * @param templatePath emails/templates/welcome
 * @param from
 * @param to
 * @param subject
 * @param data
 */
function sendWithTemplate(templatePath, from, to, subject, data) {
    const deferred = Q.defer();

    let template = new Email();
    template.render(templatePath, data)
        .then((result) => {
            transporter.sendMail({
                from: from || config.mail.from,
                to: to,
                subject: subject,
                html: result,
            }, function (error, response) {
                if (error) {
                    console.log(error);
                    deferred.reject(new errors.InvalidContentError(error.name));
                } else {
                    deferred.resolve(response)
                }

            })
        })
        .catch((error) => {
            deferred.reject(new errors.InvalidContentError(error.name));
        });

    return deferred.promise;
}

module.exports = {
    sendPlainText: sendPlainText,
    sendHtml: sendHtml,
    sendWithTemplate: sendWithTemplate
};