import { useEffect, useRef } from 'react';

const usePageUnload = (callback: () => void) => {
  const cb = useRef(callback);

  useEffect(() => {
    cb.current = callback;
  }, [callback]);

  useEffect(() => {
    const onUnload = () => cb.current();

    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, []);
};

export default usePageUnload;
