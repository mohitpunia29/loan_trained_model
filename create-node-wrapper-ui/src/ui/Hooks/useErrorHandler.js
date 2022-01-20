import { useEffect } from 'react';
import { useSnackbar } from 'notistack';

export default function useErrorHandler(socket) {
  const { enqueueSnackbar } = useSnackbar();

  const socketHandlers = {
    notification: (notification) => {
      // eslint-disable-next-line no-console
      console.log('useErrorHandler notification', notification);
      if (notification.namespace === 'errorNotify') {
        handleErrorNotification(notification);
      }
    }
  };

  useEffect(() => {
    if (socket) {
      socket.addHandlers(socketHandlers);
    }

    return () => {
      if (socket) {
        socket.removeHandlers(socketHandlers);
      }
    };
  }, [socket]);

  function handleErrorNotification(notification) {
    const { error } = notification.body;
    enqueueSnackbar(error.message, { variant: 'error' });
  }
}
