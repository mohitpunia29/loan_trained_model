import React from 'react';

// import VpnKeyRoundedIcon from '@material-ui/icons/VpnKeyRounded';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import WebIcon from '@material-ui/icons/Web';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GraphIcon from '../../Components/Icons/Graph';
import ChartIcon from '../../Components/Icons/Chart';
import SettingsIcon from '../../Components/Icons/Settings';
import UserIcon from '../../Components/Icons/User';
// import GroupIcon from '../../Components/Icons/Group';
// import FolderIcon from '../../Components/Icons/Folder';

export const invitationsManagement = {
  title: 'Invitations Management',
  icon : <PersonAddIcon fontSize='medium' />
};

export const usersManagement = {
  title: 'Users Management',
  icon : <UserIcon />
};

export const roleManagement = {
  title: 'Role Management',
  icon : <WebIcon />
};

export const tempSection = {
  title: 'Temp Settings',
  icon : <WebIcon />
};


// This is where testing for the new react dashboard begins, this "new analytics component will serve well to make the ideas from sketch come to life."

export const newAnalytics = {
  title: "Tools Pane",
  icon : <SettingsIcon />
}

export const userAnalytics = {
  title: 'User Analytics',
  icon : <GraphIcon color='black' />
};

export const dashboard = {
  title: 'Recent Activity',
  icon : <ChartIcon />
};

export const resourceManagement = {
  title: 'Resource Mangement',
  icon : <SettingsIcon />
};

export const registries = {
  title: 'Libraries',
  icon : <LibraryBooksIcon />
};
