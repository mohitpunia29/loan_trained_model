/* eslint-disable global-require */
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
// const AutoDllPlugin = require('autodll-webpack-plugin');
// const fastRefreshCracoPlugin = require('craco-fast-refresh');

// https://github.com/pmmmwh/react-refresh-webpack-plugin
// https://github.com/esetnik/customize-cra-react-refresh/blob/master/index.js
// eslint-disable-next-line import/no-extraneous-dependencies

const fs = require('fs');

const _ = require('lodash');

let config = require('./config/craco/development.config.json');

try {
  // eslint-disable-next-line import/no-unresolved
  const prodConfig = require('./config/craco/production.config.json');
  // features are booleans, which means if a feature is missing it is not added
  // all the features are true in development, so we omit them when merging
  config = _.merge(_.omit(config, 'features'), prodConfig);
} catch (e) {
  console.log('No production config found');
}

// Theme environment
let themeEnvironment = 'development';
try {
  const prodThemeCSS = require('./config/craco/production.theme.css');
  themeEnvironment = 'production';
} catch (e) {
  console.log('No production theme css found');
}

const isDevelopment = config.env.DEV_MODE ? true : false;

console.log('### DEVMODE', isDevelopment);

const plugins = [
  new webpack.DefinePlugin({
    'process.env': JSON.stringify({
      ..._.reduce(config.env, (result, val, key) => {
        // eslint-disable-next-line no-param-reassign
        result[`REACT_APP_${key.toUpperCase()}`] = val;

        return result;
      }, {}),
      REACT_APP_NTFY_CONFIG: config
    })
  }),
  new webpack.NormalModuleReplacementPlugin(
    /src\/theme\.css/,
    `${__dirname}/config/craco/${themeEnvironment}.theme.css`
  )
  // const getRegex = (env) => new RegExp('^\\.\/ui\/(' + Object.keys(clientConfig[env]).join('|') + ').*', 'i');
  // new webpack.debug.ProfilingPlugin({
  //   outputPath: 'profileEvents.json'
  // })
  // new webpack.IgnorePlugin({
  //   resourceRegExp: getRegex(env),
  //   contextRegExp: /.*/
  // })
];
// I used this plugin to enable fast refresh up until craco-fast-refresh became available
// if (isDevelopment) plugins.push(new ReactRefreshWebpackPlugin());

if (config.features) {       // process.env.NODE_ENV === 'production'
  const activeModules = Object.keys(config.features).reduce((acc, moduleName) => {
    if (!config.features[moduleName]) acc.push(moduleName.replace(/^\w/, (c) => c.toUpperCase()));
    return acc;
  }, []);
  const modulesRegex = new RegExp(`src/ui/(${activeModules.join('|')})/(${activeModules.join('|')}).js`);

  plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      modulesRegex,
      `${__dirname}/src/ui/EmptyModule.js`
    )
  );

  if (!config.features.scatterPlot) {
    plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        new RegExp('src/ui/Components/Graphs/Charts/3D/ScatterPlot/ScatterPlot.js'),
        `${__dirname}/src/ui/EmptyModule.js`
      )
    );
  }
}

// https://github.com/sharegate/craco/blob/master/packages/craco/README.md#configuration-overview
module.exports = ({ env, paths }) => ({
  eslint: {
    enable: false
  },
  // plugins: [
  //   // { plugin: fastRefreshCracoPlugin },
  //   { plugin: AutoDLL }
  // ],
  babel: {
    plugins: []
  },
  webpack: {
    plugins,
    configure: (webpackConfig) => {
      // eslint-disable-next-line no-param-reassign
      webpackConfig.resolve.alias['@assets'] = path.resolve(__dirname, 'src', 'assets');
      // webpackConfig.optimization.minimize = !isDevelopment;
      // webpackConfig.options.sideEffects = false;
      // console.log(webpackConfig);
      return webpackConfig;
    }
  },
  // devServer: (devServerConfig, { proxy, allowedHost }) => {
  //   process.env.FAST_REFRESH = true;
  //   fs.writeFile('craco.build.export.json', JSON.stringify(process.env, null, 2), (err) => {
  //     if (err) return console.log(err);
  //     console.log('more build info in craco.build.export.json');
  //   });
  //   return devServerConfig;
  // }
});
