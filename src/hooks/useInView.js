import { useEffect, useState, useRef } from 'react';

/**
 * 要素がビューポートに入ったかどうかを検知するフック
 * @param {Object} options - IntersectionObserver のオプション
 * @param {number} [options.threshold=0.1] - 検知する交差率（0〜1）
 * @param {string} [options.rootMargin='0px 0px -40px 0px'] - 下方向に少し早めに発火
 * @returns {[React.RefObject, boolean]} [ref, isInView]
 */
export function useInView(options = {}) {
  const { threshold = 0.1, rootMargin = '0px 0px -40px 0px' } = options;
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isInView];
}
