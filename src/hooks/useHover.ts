import { useEffect, useRef, useState } from 'react';

const useHover = () => {
  const [isHovered, setIsHovered] = useState(false);

  const hoverRef = useRef<HTMLDivElement>(null);

  const handleMouseOver = () => setIsHovered(true);
  const handleMouseOut = () => setIsHovered(false);

  useEffect(() => {
    const node = hoverRef.current;
    node && node.addEventListener('mouseover', handleMouseOver);
    node && node.addEventListener('mouseout', handleMouseOut);

    return () => {
      node && node.removeEventListener('mouseover', handleMouseOver);
      node && node.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return { hoverRef, isHovered };
};

export default useHover;
