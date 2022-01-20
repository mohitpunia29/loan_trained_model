import React, { Component, useContext } from 'react';

import {
  get as _get,
  has as _has,
  isEmpty as _isEmpty
} from 'lodash';

import restConfig from '../../config/rest';
// import USERS from '../config/users';

// const USERS = [];

export const ConfigContext = React.createContext({});

class ConfigProvider extends Component {
  constructor(props) {
    super(props);

    const state = {
      users  : JSON.parse(sessionStorage.getItem('users') || '{}'),
      modules: JSON.parse(sessionStorage.getItem('modules') || '{}')
    };

    this.state = this.getInitialState(state);

    this.saveToLocalStorage();
  }

  getInitialState = (state = { users: {}, modules: {} }) => {
    // eslint-disable-next-line guard-for-in
    for (const moduleName in restConfig) {
      const moduleData = restConfig[moduleName];

      if (!_has(state.modules, moduleName)) {
        state.modules[moduleName] = {
          url       : restConfig[moduleName].url,
          activeUser: state.users.length >= moduleData.activeUser ? moduleData.activeUser : 0
        };
      } else {
        restConfig[moduleName].url = state.modules[moduleName].url;
      }
    }

    for (const moduleName in state.modules) {
      if (!restConfig[moduleName]) {
        delete state.modules[moduleName];
      }
    }

    return state;
  }

  saveToLocalStorage = () => {
    const { users, modules } = this.state;
    sessionStorage.setItem('users', JSON.stringify(users));
    sessionStorage.setItem('modules', JSON.stringify(modules));
  }

  isAuthenticated = (/* moduleName */) => {
    // console.log('isAuthenticated', this.getUserByModule(/* moduleName */));

    return !_isEmpty(this.getUserByModule(/* moduleName */).authInfo);
  };

  isOnboarded = (/* moduleName */) => {
    // console.log('isOnboarded', this.getUserByModule(/* moduleName */));
    const { authInfo } = this.getUserByModule(/* moduleName */);

    return authInfo && authInfo.isOnboarded;
  };

  isSSO = (/* moduleName */) => {
    // console.log('isOnboarded', this.getUserByModule(/* moduleName */));
    const { authInfo } = this.getUserByModule(/* moduleName */);

    return authInfo && authInfo.isSSO;
  };

  isClient = (/* moduleName */) => {
    // console.log('isOnboarded', this.getUserByModule(/* moduleName */));
    const { authInfo } = this.getUserByModule(/* moduleName */);

    return authInfo && authInfo.profile && authInfo.profile.userType && authInfo.profile.userType === 'client';
  };

  userType = (/* moduleName */) => {
    // console.log('isOnboarded', this.getUserByModule(/* moduleName */));
    const { authInfo } = this.getUserByModule(/* moduleName */);

    return authInfo && authInfo.profile && authInfo.profile.userType;
  };

  // This is a DEV MODE function to change userType for easier QA
  setUserType = (type) => {
    this.setState((prevState) => {
      const { url } = prevState.modules.fileStore;
      const newUsers = { ...prevState.users };
      newUsers[url][0].authInfo.profile.userType = type;
      return {
        ...prevState,
        users: { ...newUsers }
      };
    }, () => {
      this.saveToLocalStorage();
    });
  };

  isUserManager = (/* moduleName */) => {
    // console.log('isOnboarded', this.getUserByModule(/* moduleName */));
    const { authInfo } = this.getUserByModule(/* moduleName */);

    return authInfo && authInfo.profile && authInfo.profile.isUserManager;
  };

  onActiveUserSwitch = (moduleName, userIndex) => {
    let modules;

    // console.log('onActiveUserSwitch', moduleName, userIndex);

    this.setState((prevState) => {
      modules = {
        ...prevState.modules,
        [moduleName]: {
          ...prevState.modules[moduleName],
          activeUser: userIndex
        }
      };

      return {
        ...prevState,
        modules
      };
    }, () => {
      this.saveToLocalStorage();
    });
  }

  onUrlChange = (moduleName, url) => {
    let modules;

    restConfig[moduleName].url = url;

    this.setState((prevState) => {
      modules = {
        ...prevState.modules,
        [moduleName]: {
          ...prevState.modules[moduleName],
          url
        }
      };

      return {
        ...prevState,
        modules
      };
    }, () => {
      this.saveToLocalStorage();
    });
  }

  onActiveUserDataChange = (moduleName, data) => {
    this.setState((prevState) => {
      const { users, modules } = prevState;
      const mod = modules[moduleName];

      if (!mod) {
        throw new Error(`Unknown module ${moduleName}`);
      }

      if (!users[mod.url]) {
        users[mod.url] = {};
      }
      users[mod.url][mod.activeUser] = { ...data };

      return {
        ...prevState,
        users: { ...users }
      };
    }, () => {
      this.saveToLocalStorage();
    });
  }

  onEndpointDataChange = (url, data) => {
    this.setState((prevState) => {
      const { users } = prevState;
      if (!users[url]) {
        users[url] = [];
      }
      users[url][0] = {
        authInfo   : data,
        credentials: {}
      };

      return {
        ...prevState,
        users: { ...users }
      };
    }, () => {
      this.saveToLocalStorage();
    });
  }

  onAuthInfoExpired = () => {
    const state = this.getInitialState();

    this.setState(state, () => {
      this.saveToLocalStorage();
    });
  }

  getUserByModule = (/* moduleName */) => {
    const { users, modules } = this.state;
    const mod = modules.fileStore; // All the modules use the fileStore authentication

    // if (!mod) {
    //   throw new Error('Unknown module ' + moduleName);
    // }

    return {
      // credentials: _get(USERS, `${mod.activeUser}.credentials`, {}),
      authInfo: _get(users[mod.url], '0.authInfo', {})
    };
  }

  getModuleInfo = (moduleName) => {
    const { modules } = this.state;

    return modules[moduleName];
  }

  render() {
    return (
      <ConfigContext.Provider
        value={{
          state                 : this.state,
          getUserByModule       : this.getUserByModule,
          getModuleInfo         : this.getModuleInfo,
          onActiveUserSwitch    : this.onActiveUserSwitch,
          onUrlChange           : this.onUrlChange,
          onActiveUserDataChange: this.onActiveUserDataChange,
          onEndpointDataChange  : this.onEndpointDataChange,
          onAuthInfoExpired     : this.onAuthInfoExpired,
          isAuthenticated       : this.isAuthenticated,
          isOnboarded           : this.isOnboarded,
          isSSO                 : this.isSSO,
          isClient              : this.isClient,
          userType              : this.userType,
          setUserType           : this.setUserType,
          isUserManager         : this.isUserManager
        }}
      >
        {this.props.children}
      </ConfigContext.Provider>
    );
  }
}

export default ConfigProvider;

export function withConfigContext(Component, moduleName) {
  return function WrapperComponent(props) {
    return (
      <ConfigContext.Consumer>
        {(context) => {
          if (moduleName) {
            context.state = {
              user      : context.getUserByModule(moduleName),
              moduleInfo: context.getModuleInfo(moduleName),
              modules   : context.state.modules
            };
          }

          return <Component {...props} configContext={context} />;
        }}
      </ConfigContext.Consumer>
    );
  };
}

export function useConfigContext(moduleName) {
  const context = useContext(ConfigContext);

  return {
    ...context,
    state: {
      user      : context.getUserByModule(moduleName),
      moduleInfo: context.getModuleInfo(moduleName),
      modules   : context.state.modules
    }
  };
}
