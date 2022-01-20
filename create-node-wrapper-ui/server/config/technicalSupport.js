const path = require('path');

module.exports = {
  SMTP_HOST                      : process.env.NTFY_CFG_SMTP_HOST || 'secure.emailsrvr.com',
  SMTP_PORT                      : process.env.NTFY_CFG_SMTP_PORT || '465',
  SMTP_AUTH_USER                 : process.env.NTFY_CFG_SMTP_AUTH_USER,
  SMTP_AUTH_PWD                  : process.env.NTFY_CFG_SMTP_AUTH_PWD,
  TECHNICAL_SUPPORT_CSV_FILE_PATH: process.env.NTFY_CFG_TECHNICAL_SUPPORT_CSV_FILE_PATH ||
    path.resolve('..', '..', 'technicalSupport.csv')
};
