import { useEffect, useState } from 'react';

/** 滚动超过阈值时为导航栏加深背景 */
export function useNavElevated(threshold = 48) {
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return elevated;
}
