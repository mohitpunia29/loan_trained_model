import React, { lazy, useRef } from 'react';

import { Switch, Redirect, Route } from 'react-router-dom';
import Vimeo from '@u-wave/react-vimeo';

import serviceRoutes from '../constants/serviceRoutes';
import { useConfigContext } from '../Providers/ConfigProvider/ConfigProvider';

import useRefDimensions from '../Hooks/useRefDimensions';

import { get as getConfig } from '../config/core';

import styles from './Auth.module.css';

const { VIDEO } = getConfig('modules.auth.variables', {});

const {
  LOGIN_ROUTE, SIGN_UP_ROUTE, VERIFIED,
  FORGOT_PASSWORD, SET_PRIMARY_CONTACT_INFO,
  RESET_PASSWORD, ACCOUNT_ACTIVATION_CHANGE_PASSWORD,
  WELCOME, CHOOSE_TYPE_LOGIN_ROUTE, DENIED,
  CLIENT_LOGIN_ROUTE, SINGLE_SIGN_ON
} = serviceRoutes;

const Login = lazy(() => import('./Login/Login'));
const LoginChooseType = lazy(() => import('./LoginChooseType/LoginChooseType'));
const SignUp = lazy(() => import('./SignUp/SignUp'));
const SingleSignOn = lazy(() => import('./SingleSignOn/SingleSignOn'));
const SetPrimaryContactInfo = lazy(() => import('./SetPrimaryContactInfo/SetPrimaryContactInfo'));
const Denied = lazy(() => import('./Denied/Denied'));
const Verified = lazy(() => import('./Verified/Verified'));
const ForgotPassword = lazy(() => import('./ForgotPassword/ForgotPassword'));
const ResetPassword = lazy(() => import('./ResetPassword/ResetPassword'));
const AccountActivationChangePassword = lazy(() => import(
  './AccountActivationChangePassword/AccountActivationChangePassword'
));
const Welcome = lazy(() => import('./Welcome/Welcome'));

const RATIO = 1920 / 1080;

export default function Auth() {
  const configContext = useConfigContext();
  const rootRef = useRef(null);
  const [{ width, height }] = useRefDimensions(rootRef);

  const wide = width / height > RATIO;
  const videoWidth = wide ? width : height * (RATIO + 0.2);

  const DEFAULT_ROUTE = LOGIN_ROUTE;

  return (
    <div className={styles.root} ref={rootRef} style={{ width: document.body.clientWidth }}>
      <Switch>
        <Route
          path={LOGIN_ROUTE}
          render={() => <Login />}
        />
        <Route
          path={CLIENT_LOGIN_ROUTE}
          render={() => <Login name={getConfig('modules.common.COMPANY_NAME')} />}
        />

        <Route
          path={SIGN_UP_ROUTE}
          render={() => <SignUp />}
        />
        <Route
          path={SINGLE_SIGN_ON}
          render={() => <SingleSignOn />}
        />
        <Route
          path={DENIED}
          render={() => <Denied />}
        />
        <Route
          path={SET_PRIMARY_CONTACT_INFO}
          render={() => <SetPrimaryContactInfo />}
        />
        <Route
          path={VERIFIED}
          render={() => <Verified />}
        />
        <Route
          path={FORGOT_PASSWORD}
          render={() => <ForgotPassword />}
        />
        <Route
          path={RESET_PASSWORD}
          render={() => <ResetPassword />}
        />
        <Route
          path={ACCOUNT_ACTIVATION_CHANGE_PASSWORD}
          render={() => {
            if (!configContext.isAuthenticated()) {
              return <Redirect to={DEFAULT_ROUTE} />;
            }

            return <AccountActivationChangePassword />;
          }}
        />
        <Route
          path={WELCOME}
          render={() => {
            if (!configContext.isAuthenticated()) {
              return <Redirect to={DEFAULT_ROUTE} />;
            }

            return <Welcome />;
          }}
        />
        <Redirect to={DEFAULT_ROUTE} />
      </Switch>
      {VIDEO && (
        <div className={styles.videoBottom} style={{ width }}>
          <div style={{ width: videoWidth, height, marginLeft: (width - videoWidth) / 2 }}>
            <Vimeo
              video={VIDEO}
              className={styles.videoBottom__vimeo}
              // wish there was an easy way to make it responsive
              // Alex: it is by setting the container's dimensions and prop responsive
              // width={1920}
              // height={1080}
              onLoaded={() => window.dispatchEvent(new Event('resize'))}
              background
              responsive
              autoplay
              muted
              loop
            />
          </div>
        </div>
      )}
    </div>
  );
}
