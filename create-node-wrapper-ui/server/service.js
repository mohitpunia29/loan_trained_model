'use strict';

const bodyParser = require('body-parser');
const compression = require('compression');
const debug = require('debug')('index');
const express = require('express');
const path = require('path');
const Promise = require('bluebird');

const config = require('./config');
const { clientErrorHandler } = require('./middlewares');
const { getLinkHeaderForServerPush } = require('./modules/serveClientHelpers');

const fileRoutes = require('./routes/file/routes');
const modelsRoutes = require('./routes/providers/routes');
const providerConfigRoutes = require('./routes/config/routes');
const dataVisualizationRoutes = require('./routes/dataVisualization/routes');
const csvRoutes = require('./routes/csv/routes');
const technicalSupportRoutes = require('./routes/technicalSupport/routes');
const techtonikRoutes = require('./routes/techtonik/routes');

class Service {
  async start() {
    debug('start');

    this._app = express();

    /**
     * Serve browser
     */
    // eslint-disable-next-line no-process-env
    const dir = process.env.BUILD_DIR || 'build';

    const BUILD_DIR = path.join(__dirname, '..', dir);
    const STATIC_DIR = path.join(BUILD_DIR, 'static');

    // calculate it once
    const LINK_HEADER = await getLinkHeaderForServerPush(BUILD_DIR);

    this._app.get([/^\/$/, '/index.html'], function(req, res) {
      res.set('Link', LINK_HEADER);
      res.sendFile(path.join(BUILD_DIR, 'index.html'));
    });
    this._app.use(express.static(BUILD_DIR));
    this._app.use('/static', express.static(STATIC_DIR));

    /**
     * Server
     */
    this._app.use(compression());
    this._app.use(bodyParser.json({
      type : 'application/json',
      limit: '10mb'
    }));

    // Add cors for localhost
    this._app.use(function(req, res, next) {
      if (/localhost/.test(req.headers.origin) && /localhost/.test(req.headers.host)) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
          'Access-Control-Allow-Headers',
          'Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept'
        );
      }
      next();
    });
    this._app.use('/computerVision/file', fileRoutes);
    this._app.use('/csv', csvRoutes);
    this._app.use('/models', modelsRoutes);
    this._app.use('/providers/config', providerConfigRoutes);
    this._app.use('/dataVisualization', dataVisualizationRoutes);
    this._app.use('/technicalSupport', technicalSupportRoutes);
    this._app.use('/techtonik', techtonikRoutes);

    this._app.use(clientErrorHandler());

    return Promise.fromCallback((cb) => {
      // Start the server
      this._server = this._app.listen(config.rest.port, cb);
    })
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('Server started using port %d', config.rest.port);
      });
  }

  stop() {
    debug('stop');

    return Promise.fromCallback((cb) => {
      this._server.close(cb);
    })
      .then(() => {
        return this.shutdown();
      });
  }
}

module.exports = Service;
