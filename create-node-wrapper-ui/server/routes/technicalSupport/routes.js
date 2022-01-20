const _ = require('lodash');
const Promise = require('bluebird');
const express = require('express');

const router = express.Router();

const sendEmail = require('./modules/sendEmail');
const saveToCsv = require('./modules/saveToCsv');
const toUtcString = require('../../modules/toUtcString');

const { sendResponse } = require('../../middlewares');

const checks = ['from', 'subject', 'text'];

router.post('/', async (req, res, next) => {
  const err = _.filter(checks, check => !req.body[check]);

  if (err.length) {
    const plural = err.length > 1;
    return next({
      statusCode: '400',
      code      : '001',
      reason    : 'MISSING_EMAIL_PARAMS',
      message   : `Parameter${plural ? 's' : ''} ${err.join(', ')} ${plural ? 'are' : 'is'} required`
    });
  }

  const { from, subject, text } = req.body;

  const mailPayload = {
    to     : 'support@entefy.com',
    subject: `Support form: ${subject}`,
    text   : `From: ${from}\n\n${text}`,
    from
  };

  try {
    const [response] = await Promise.all([
      // sendEmail mutates the object
      sendEmail(_.cloneDeep(mailPayload)),
      saveToCsv(_.defaults({
        timestamp: toUtcString()
      }, mailPayload))
    ]);

    sendResponse({ responsePayload: response }, res);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
