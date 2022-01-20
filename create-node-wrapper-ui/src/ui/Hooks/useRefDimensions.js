import { useState, useEffect } from 'react';

export default function useRefDimensions(ref, { isSvg } = {}) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    window.addEventListener('resize', handleDimensionsChange);

    return () => {
      window.removeEventListener('resize', handleDimensionsChange);
    };
  }, []);

  // trigger window resize onMount
  useEffect(() => {
    handleDimensionsChange();
  }, []);

  // Unless ref.current exists, we cannot measure the size of the element
  useEffect(() => {
    if (ref && ref.current) {
      handleDimensionsChange();
    }
  }, [ref && ref.current]);

  function handleDimensionsChange() {
    if (ref && ref.current) {
      setWidth(isSvg ? ref.current.getBBox().width : ref.current.clientWidth);
      setHeight(isSvg ? ref.current.getBBox().height : ref.current.clientHeight);
    }
  }

  return [{ width, height }, handleDimensionsChange];
}
