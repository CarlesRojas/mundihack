import debounce from 'lodash/debounce';
import { useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useResize(callback: (...args: any[]) => any, callOnStart = false) {
  const handleResize = debounce(callback, 500, { leading: false, trailing: true });

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current && callOnStart) callback();
    firstRun.current = false;
  }, [callOnStart, callback]);

  return;
}
