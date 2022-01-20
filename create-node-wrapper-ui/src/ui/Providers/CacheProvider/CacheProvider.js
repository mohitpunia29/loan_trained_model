import React, { useState, useEffect } from 'react';

import { isEmpty as _isEmpty, isEqual as _isEqual } from 'lodash';
import { useConfigContext } from '../ConfigProvider/ConfigProvider';
import usePrevious from '../../Hooks/usePrevious';

import { getAccountSettings, updateAccountSettings } from '../../utils/userAccount';

export const CacheContext = React.createContext();

const CacheProvider = ({ children }) => {
  const configContext = useConfigContext('fileStore');
  const { state: { user }, onActiveUserDataChange } = configContext;
  const { authInfo: { authToken, sessionId, isOnboarded, rootFolderId } } = user;
  const [cache, setCache] = useState({});
  const previousCache = usePrevious(cache);

  const setObjectsToCache = (objects) => {
    setCache((prevCache) => ({
      ...prevCache,
      rerun: true,
      ...objects
    }));
  };

  // load from Local Storage
  useEffect(() => {
    if (authToken) {
      // console.log(`SSO: http://localhost:3000/#/auth/sso?authToken=${authToken}&isOnboarded=${isOnboarded}&sessionId=${sessionId}`);
      getCacheFromSettings();

      // Use of LocalStorage
      // const localCache = JSON.parse(localStorage.getItem('cache'));
      // if (!_isEmpty(localCache)) setCache(localCache);
    } else {
      setCache({});
    }
  }, [authToken]);

  useEffect(() => {
    if (!_isEmpty(cache) && !_isEmpty(previousCache)) {
      if (cache.rerun || !_isEqual(cache.activeFilters, previousCache.activeFilters) ||
          !_isEqual(JSON.stringify(cache.customFilterSets), JSON.stringify(previousCache.customFilterSets))) {
        const { activeFilters, customFilterSets, styleSelection } = cache;
        saveCacheToSettings({
          activeFilters,
          customFilterSets,
          styleSelection,
          rerun: false
        });
        // localStorage.setItem('cache', JSON.stringify({
        //   activeFilters,
        //   customFilterSets
        // }));
      }
    }
  }, [cache]);

  async function getCacheFromSettings() {
    try {
      const settingsResponse = await getAccountSettings(authToken);
      if (settingsResponse.success) {
        const { activeFilters, customFilterSets, styleSelection } = settingsResponse.data.data;
        console.log('cache loaded', settingsResponse.data.data);
        setCache((prevState) => ({
          ...prevState,
          activeFilters,
          styleSelection,
          customFilterSets
        }));
      } else {
        console.log('settingsResponse load error', settingsResponse.data);
      }
    } catch (e) {
      console.log('Error', e);
    }
  }

  async function saveCacheToSettings(payload) {
    try {
      const settingsResponse = await updateAccountSettings(authToken, payload);
      if (settingsResponse.success) {
        // console.log('settingsResponse save success', payload);
        // const testing = await getAccountSettings(authToken);
        // console.log('settingsResponse load', testing.data.data);
      } else {
        console.log('settingsResponse save error', settingsResponse.data);
      }
    } catch (e) {
      console.log('Error', e);
    }
  }

  return (
    <CacheContext.Provider value={{ cache, setCache, setObjectsToCache }}>
      {children}
    </CacheContext.Provider>
  );
};

export default CacheProvider;
