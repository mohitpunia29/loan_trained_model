import { useEffect, useRef } from 'react';
// based on https://github.com/xnimorz/use-debounce and
// https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci/comments

export default function useDebouncedCallback(callback, wait) {
  // track args & timeout handle between calls
  const argsRef = useRef();
  const timeout = useRef();

  function cleanup() {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }

  // make sure our timeout gets cleared if
  // our consuming component gets unmounted
  useEffect(() => cleanup, []);

  return function debouncedCallback(
    ...args
  ) {
    // capture latest args
    argsRef.current = args;

    // clear debounce timer
    cleanup();

    // start waiting again
    timeout.current = setTimeout(() => {
      if (argsRef.current) {
        callback(...argsRef.current);
      }
    }, wait);
  };
}
