import { useState, useEffect } from 'react';

export default function useWindowResize() {
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      windowWidth : isClient ? window.innerWidth : undefined,
      windowHeight: isClient ? window.innerHeight : undefined
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
