import { useEffect, useRef } from 'react';

export default function useClickOutside(callback) {
  const ref = useRef();

  function handleClick(e) {
    if (ref.current.contains(e.target)) {
      // inside click
      return;
    }

    callback();
  }

  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  });

  return [ref];
}
