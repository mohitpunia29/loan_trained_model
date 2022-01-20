import { useEffect, useRef } from 'react';

import createSocket from '../utils/socket';

export default function useSocket({ authToken }) {
  // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
  const socket = useRef(null);

  useEffect(() => {
    if (authToken) {
      // Hooking up to socket for AIUpdate notifications
      socket.current = createSocket({ authToken });
    }

    return () => {
      if (socket.current && socket.current.disconnect) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [authToken]);

  return [socket.current];
}
