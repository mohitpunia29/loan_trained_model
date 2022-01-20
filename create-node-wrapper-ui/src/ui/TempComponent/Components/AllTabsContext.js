/* eslint-disable max-len */
import React, { useState, createContext, useEffect } from 'react';

import { useConfigContext } from '../../Providers/ConfigProvider/ConfigProvider';
import * as TempAPI from '../utils/api';

export const AllTabsContext = createContext();

export const AllTabsProvider = (props) => {
  const [users, setUsers] = useState([]);
  const [emailRules, setEmailRules] = useState([]);

  const configContext = useConfigContext('fileStore');
  const { state: { user } } = configContext;
  const { authInfo: { authToken, sessionId, isOnboarded, rootFolderId } } = user;

  useEffect(() => {
    getDataFromApi();
  }, []);

  async function getDataFromApi() {
    const usersResponse = await TempAPI.getUsers(authToken);
    if (usersResponse.data.success) {
      setUsers(usersResponse.data.data.list);
    } else {
      console.log('error getting users');
    }
    const emailRulesResponse = await TempAPI.getEmailRules(authToken);
    if (emailRulesResponse.data.success) {
      setEmailRules(emailRulesResponse.data.data.list);
    } else {
      console.log('error getting registry for fabricCosts');
    }
  }

  return (
    <AllTabsContext.Provider value={{ users: [users, setUsers], emailRules: [emailRules, setEmailRules] }}>
      {props.children}
    </AllTabsContext.Provider>
  );
};
