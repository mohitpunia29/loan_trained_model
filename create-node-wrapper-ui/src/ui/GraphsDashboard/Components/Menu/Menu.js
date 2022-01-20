import React from 'react';
import PropTypes from 'prop-types';
import { Paper, MenuList, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { map as _map } from 'lodash';
import bindClassnames from 'classnames/bind';

import styles from './Menu.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function Menu({ menu, baseRoute }) {
  return (
    <Paper
      elevation={1}
      square
      classes={{ root: classnames('root') }}
    >
      <MenuList>
        {_map(menu, ({ name, icon: Icon }) => (
          <MenuItem
            key={name}
            classes={{ root: classnames('menuItem') }}
          >
            <NavLink
              to={`/${baseRoute}/${name}`}
              className={classnames('menuItemNavLink')}
              activeClassName={classnames('active')}
            >
              <ListItemIcon classes={{ root: classnames('icon') }}>
                <Icon />
              </ListItemIcon>
              <ListItemText
                classes={{ root: classnames('label') }}
                inset
                primary={name}
              />
            </NavLink>
          </MenuItem>
        ))}
      </MenuList>
    </Paper>
  );
}

Menu.propTypes = {
  menu: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    icon: PropTypes.func
  })).isRequired,
  baseRoute: PropTypes.string.isRequired
};
