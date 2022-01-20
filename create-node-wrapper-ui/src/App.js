import React, { Suspense, lazy } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {
  find as _find,
  upperFirst as _upperFirst
} from 'lodash';
import Promise from 'bluebird';

import { SnackbarProvider } from 'notistack';
import {
  HashRouter,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import serviceRoutes from './ui/constants/serviceRoutes';
import themedStyle from './ui/config/style';
import coreConfig, { get as getConfig } from './ui/config/core';

import AppBar from './ui/AppBar/AppBar';
import ConfigProvider, { useConfigContext } from './ui/Providers/ConfigProvider/ConfigProvider';
import CacheProvider from './ui/Providers/CacheProvider/CacheProvider';
import Spinner from './ui/Components/Spinner/Spinner';
import Auth from './ui/Auth/Auth';

import { MENU as barMenu } from './ui/constants/barMenu';

import styles from './App.module.css';

const { SNACKBAR } = getConfig('modules.costSheets.variables', {});

Promise.config({
  // Enable cancellation
  cancellation: true
});

const MODULES = {
  Home           : lazy(() => import('./ui/Home/Home')),
  GraphsDashboard: lazy(() => import('./ui/GraphsDashboard/GraphsDashboard')),
  TempComponent  : lazy(() => import('./ui/TempComponent/TempComponent'))
};

const { ACCOUNT_ACTIVATION_CHANGE_PASSWORD, WELCOME } = serviceRoutes;

const theme = createMuiTheme(themedStyle);

export default function App() {
  const DEV_MODE = JSON.parse(localStorage.getItem('devMode'));

  return (
    <HashRouter>
      <MuiThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={5}
          classes={{ root: styles[SNACKBAR || DEV_MODE ? 'show' : 'hide'] }}
          autoHideDuration={7000}
        >
          <ConfigProvider>
            <CacheProvider>
              <AppContent />
            </CacheProvider>
          </ConfigProvider>
        </SnackbarProvider>
      </MuiThemeProvider>
    </HashRouter>
  );
}

function AppContent() {
  const configContext = useConfigContext();

  const DEFAULT_ROUTE = _find(barMenu, { isDefaultRoute: true }).path;
  return (
    <div className={styles.App}>
      <AppBar />
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route
            path='/auth'
            // component={Auth}
            render={() => {
              if (configContext.isAuthenticated() && configContext.isOnboarded()) {
                return <Redirect to={DEFAULT_ROUTE} />;
              }
              return <Auth />;
            }}
          />
          {barMenu.map((mod) => (
            // https://reacttraining.com/react-router/web/example/auth-workflow
            <Route
              key={mod.path}
              path={mod.path}
              render={({ location }) => {
                if (mod.withAuth) {
                  if (!configContext.isAuthenticated()) {
                    return (
                      <Redirect
                        to={{
                          pathname: '/auth',
                          state   : { from: location }
                        }}
                      />
                    );
                  }
                  if (!configContext.isOnboarded() && coreConfig.features.authChangePassword) {
                    return (
                      <Redirect
                        to={{
                          pathname: ACCOUNT_ACTIVATION_CHANGE_PASSWORD,
                          state   : { from: location }
                        }}
                      />
                    );
                  }
                  if (!configContext.isOnboarded() && coreConfig.features.authWelcomePage) {
                    return (
                      <Redirect
                        to={{
                          pathname: WELCOME,
                          state   : { from: location }
                        }}
                      />
                    );
                  }
                }

                const Component = MODULES[_upperFirst(mod.moduleName)];
                // safeguard
                if (!Component) {
                  throw new Error('Component does not exist', _upperFirst(mod.moduleName));
                }

                if (mod.clientOnly && !configContext.isClient()) {
                  return (
                    <Redirect
                      to={{
                        pathname: '/',
                        state   : { from: location }
                      }}
                    />
                  );
                }

                return <Component />;
              }}
            />
          ))}
          <Redirect to={DEFAULT_ROUTE} />
        </Switch>
      </Suspense>
    </div>
  );
}

function Loading() {
  return (
    <span className={styles.Loading}>
      <Spinner />
    </span>
  );
}
