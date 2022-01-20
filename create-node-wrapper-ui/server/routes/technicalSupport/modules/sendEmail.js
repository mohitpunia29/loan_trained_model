'use strict';

/**
 * @module sendEmail
 */

const _ = require('lodash');
const nodemailer = require('nodemailer');

const emailConfig = require('../../../config/technicalSupport');

const checks = ['to', 'from', 'subject', 'text'];

/**
 * Will send a noreply message using the provided opts
 *
 * @param {Object} opts
 * @param {String} opts.to
 * @param {String} opts.from
 * @param {String} opts.subject
 * @param {String} opts.text
 * @return {Promise}
 */
module.exports = function(opts) {
  const err = _.filter(checks, check => !opts[check]);

  if (err.length) {
    throw new Error(`Trying to send email with ${err.join(', ')} missing`);
  }

  const TRANSPORT_OPTS = {
    host  : emailConfig.SMTP_HOST,
    port  : emailConfig.SMTP_PORT,
    secure: true,
    auth  : {
      user: emailConfig.SMTP_AUTH_USER,
      pass: emailConfig.SMTP_AUTH_PWD
    }
  };

  const transporter = nodemailer.createTransport(TRANSPORT_OPTS);

  const EMAIL_OPTS = _.defaultsDeep(opts, {
    headers: {
      'x-mailer': 'Entefy Mailer'
    },
    from   : emailConfig.SMTP_AUTH_USER,
    replyTo: opts.from || null
  });

  return transporter.sendMail(EMAIL_OPTS);
};
