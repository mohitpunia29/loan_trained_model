const https = require('https');
const HttpsProxyAgent = require('https-proxy-agent');
const url = require('url');

const proxyConfig = require('../config/proxy');

// Proxy values, we can create them just once
const proxyOpts = url.parse(proxyConfig.url);
proxyOpts.headers = {
  'Proxy-Authorization': 'Basic ' + Buffer.from(`${proxyConfig.username}:${proxyConfig.password}`).toString('base64'),
  'Proxy-Connection'   : 'keep-alive'
};

/**
 * Makes an https request for the specified url and options.
 *
 * @param {URL}      url
 * @param {Object}   data
 * @param {String}   [method='POST']
 * @param {Object}   [headers]
 * @param {Object}   [data]
 * @param {FormData} [formData]
 * @returns {Promise}
 */
module.exports = function proxyRequest({ endpoint, data, formData, method = 'POST', headers = {} }) {
  if (data) {
    data = JSON.stringify(data);

    Object.assign(headers, {
      'Content-Type'  : 'application/json',
      'Content-Length': data.length
    });
  } else if (formData) {
    Object.assign(headers, formData.getHeaders());
  }

  const endpointUrl = url.parse(endpoint);

  const options = {
    hostname: endpointUrl.hostname,
    port    : 443,
    path    : endpointUrl.path,
    // Create an instance of the `HttpsProxyAgent` class with the proxy server information
    agent   : new HttpsProxyAgent(proxyOpts),
    method,
    headers
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (response) => {
      response.setEncoding('utf8');
      let body = '';
      response.on('data', chunk => body += chunk);
      response.on('end', () => {
        if (response.statusCode > 201) {
          console.log(`Failed to executing proxy request to ${endpoint}:\n`, body);
          reject(`Failed to executing proxy request to ${endpoint}`);
        } else {
          resolve(JSON.parse(body));
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(data);
      req.end();
    } else if (formData) {
      formData.pipe(req);
    }
  });
};
