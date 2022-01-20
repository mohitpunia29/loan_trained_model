import { useCallback, useState, useLayoutEffect } from 'react';

export default function useComponentSize(ref) {
  const [ComponentSize, setComponentSize] = useState(getSize(ref ? ref.current : {}));

  const handleResize = useCallback(() => {
    if (ref.current) {
      setComponentSize(getSize(ref.current));
    }
  }, [ref]);

  useLayoutEffect(() => {
    if (!ref.current) return;

    handleResize();

    if (typeof ResizeObserver === 'function') {
      let resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(ref.current);

      return () => {
        resizeObserver.disconnect(ref.current);
        resizeObserver = null;
      };
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref.current]);

  return ComponentSize;
}

function getSize(el) {
  if (!el) {
    return {
      width : 0,
      height: 0
    };
  }

  return {
    width : el.offsetWidth,
    height: el.offsetHeight
  };
}
