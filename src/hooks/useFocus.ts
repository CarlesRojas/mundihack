import { useEffect, useRef, useState } from 'react';

const useFocus = (focusOnMount?: boolean) => {
  const [isFocused, setIsFocused] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const focusRef = useRef<any>(null);

  const focus = () => focusRef.current && focusRef.current.focus();
  const blur = () => focusRef.current && focusRef.current.blur();

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  useEffect(() => {
    const node = focusRef.current;
    node && node.addEventListener('focus', handleFocus);
    node && node.addEventListener('blur', handleBlur);
    if (node && focusOnMount) focus();

    return () => {
      node && node.removeEventListener('focus', handleFocus);
      node && node.removeEventListener('blur', handleBlur);
    };
  }, [focusOnMount]);

  return { focusRef, isFocused, focus, blur };
};

export default useFocus;
