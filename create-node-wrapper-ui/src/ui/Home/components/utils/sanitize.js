import DOMPurify from 'dompurify';

/**
 * Sanitize the markup, when converting 'string' to 'JSX', via DOM-Purify
 *
 * @method sanitizeMarkup
 * @param  {string}       html                               The string to sanitize
 * @return {string}                                          The purified DOM string
 */
export const sanitizeMarkup = html => ({
  __html: DOMPurify.sanitize(html, {})
});

/**
 * Recursively replace all line-breaks (new-lines) from the message string.
 * Sanitize the markup for HTML, remove any harmful code injections, etc.
 *
 * @method sanitizeHtmlMessage
 * @param  {string}            message The original message
 * @return {string}                    The sanitized and HTML ready string
 */
export const sanitizeHtmlMessage = message =>
  sanitizeMarkup(message.replace(/(?:\r\n|\r|\n)/g, '<br />')).__html;
