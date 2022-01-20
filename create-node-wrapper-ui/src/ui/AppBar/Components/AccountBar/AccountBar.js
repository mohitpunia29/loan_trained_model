import React, { useState, useContext } from 'react';
import { get as _get } from 'lodash';
// import PropTypes from 'prop-types';
import { Grid, Avatar, Menu, MenuItem, Typography, Divider } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import {
  Link
} from 'react-router-dom';

import { get as getConfig } from '../../../config/core';

import { useConfigContext } from '../../../Providers/ConfigProvider/ConfigProvider';
import { logout } from '../../../utils/userAccount';
import ChangePasswordModal from '../Modals/ChangePasswordModal/ChangePasswordModal';
import WelcomeModal from '../Modals/WelcomeModal/WelcomeModal';

import styles from './AccountBar.module.css';

const signup = getConfig('modules.signup.variables');

export default function AccountBar() {
  const configContext = useConfigContext('fileStore');
  const { state: { user }, onAuthInfoExpired } = configContext;
  const { authInfo: { profile, authToken, isSSO } } = user;
  const isClient = configContext.isClient();

  const [anchorEl, setAnchorEl] = useState(null);
  const [modalToggle, setModalToggle] = useState(false);
  const [welcomeToggle, setWelcomeToggle] = useState(false);
  const open = Boolean(anchorEl);

  const name = _get(profile, 'name', 'Unverified user');
  const team = _get(profile, 'team', null);
  let avatar = _get(profile, 'personas[0].initials', '').replace(' ', '');
  if (!avatar) {
    avatar = <AccountCircleIcon />;
  }

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function openChangePasswordModal() {
    handleClose();
    setModalToggle(true);
  }

  function openWelcomeModal() {
    handleClose();
    setWelcomeToggle(true);
  }

  async function signOut() {
    try {
      await logout(authToken);
    } catch (e) {
      console.log('Failed to logout', e);
      // logout, even if the API call fails
    }
    onAuthInfoExpired();
  }

  return (
    <Grid
      container
      justify='center'
      alignItems='center'
      className={styles.root}
    >
      <Avatar
        alt={name}
        className={styles.avatar}
        tour-ref='account'
        onClick={handleMenu}
      >
        {avatar}
      </Avatar>
      <Menu
        classes={{ paper: styles.accountMenu }}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical  : 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical  : 'top',
          horizontal: 'right'
        }}
        open={open}
        onClose={handleClose}
      >
        <Typography
          variant='body2'
          classes={{ root: styles.accountName }}
        >
          {name}
        </Typography>
        {team ? (
          <Typography
            variant='body2'
            classes={{ root: styles.team }}
          >
            {team}
          </Typography>
        ) : null}
        <Divider light />
        <MenuItem onClick={openWelcomeModal}>About the Application</MenuItem>
        {isClient && <Link to='/administration' style={{ textDecoration: 'none' }}><MenuItem onClick={handleClose}>Administration</MenuItem></Link>}
        {!signup.WITHOUT_PASSWORD_CHANGE && !isSSO && (<MenuItem onClick={openChangePasswordModal}>Change Password</MenuItem>)}
        <MenuItem onClick={signOut}>Logout</MenuItem>
      </Menu>
      <ChangePasswordModal open={modalToggle} closeModal={() => setModalToggle(false)} />
      <WelcomeModal open={welcomeToggle} closeModal={() => setWelcomeToggle(false)} />
    </Grid>
  );
}
