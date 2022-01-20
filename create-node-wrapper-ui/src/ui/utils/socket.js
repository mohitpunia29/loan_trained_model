import io from 'socket.io-client';
import {
  forEach as _forEach
} from 'lodash';

import restConfig from '../config/rest';

const STATUS = {
  NOT_CONNECTED       : 'not_connected', // needs to connect
  CONNECT             : 'connect',
  CONNECTING          : 'connecting',
  CONNECTED           : 'connected',
  CONNECT_ERROR       : 'connect_error',
  RECONNECTING        : 'reconnecting',
  RECONNECT           : 'will_reconnect',
  FAILED_TO_CONNECT   : 'failed_to_connect',
  RECONNECTION_PAUSED : 'reconnection_paused', // waiting for the backOff to expire before retrying
  RECONNECTTION_FAILED: 'reconnect_failed',
  WILL_DISCONNECT     : 'will_disconnect',
  DISCONNECTING       : 'disconnecting',
  DISCONNECT          : 'disconnect'
};

/**
 * Connects to the socket endpoint
 *
 * @method createSocket
 * @param  {String}     authToken
 * @param  {Object}     [args]
 * @param  {Object}     [args.path='/socket.io']
 * @param  {Object}     [args.handlers] - key is the event name, value is the handler function
 * @return {Socket}
 */
export default function createSocket({ url, path = '/socket.io', authToken, handlers = {} } = {}) {
  if (!url) {
    // eslint-disable-next-line prefer-destructuring, no-param-reassign
    url = restConfig.fileStore.url;
  }
  const query = {};
  if (authToken) {
    query.authorization = `Bearer ${authToken}`;
  }
  const socketOptions = {
    path,
    query,
    multiplex           : false,
    transports          : ['websocket'],
    reconnection        : true,
    reconnectionDelay   : 3000,
    reconnectionDelayMax: 4000,
    reconnectionAttempts: 1
  };

  const socket = io.connect(url, socketOptions);

  const defaultHandlers = {
    // Fire other actions based on Socket responses
    // Socket has been successfully connected
    [STATUS.CONNECT]: () => {
      console.log('Socket : connect :', socket.connected); // eslint-disable-line no-console
    },
    // socket.on('connect_timeout', resp => console.log('Socket : connect_timeout :', resp));
    [STATUS.RECONNECTING]: (resp) => {
      console.log('Socket : reconnecting :', resp); // eslint-disable-line no-console
    },
    [STATUS.RECONNECTTION_FAILED]: (resp) => {
      console.log('Socket : reconnect_failed :', resp); // eslint-disable-line no-console
    },
    // Socket has failed to connect
    [STATUS.CONNECT_ERROR]: (resp) => {
      console.log('Socket : connect_error :', resp); // eslint-disable-line no-console
    },
    // socket.on('error', resp => console.log('Socket : error :', resp));
    // Socket has been successfully disconnected
    [STATUS.DISCONNECT]: (resp) => {
      console.log('Socket : disconnect :', resp); // eslint-disable-line no-console
    }
  };

  addHandlers(defaultHandlers);
  addHandlers(handlers);

  function addHandlers(newHandlers = {}) {
    _forEach(newHandlers, (handler, event) => {
      socket.on(event, handler);
    });
  }

  function removeHandlers(handlersToRemove = {}) {
    _forEach(handlersToRemove, (handler, event) => {
      socket.off(event, handler);
    });
  }

  return {
    addHandlers,
    removeHandlers,
    disconnect: () => {
      socket.disconnect();
    },
    emit: (action, data) => {
      socket.emit(action, data);
    }
  };
}
