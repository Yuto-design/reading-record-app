import { useEffect, useState } from 'react';

/**
 * 0 から value までイージング付きでカウントアップする
 * @param {number} value - 目標値
 * @param {number} duration - アニメーション時間（ms）
 * @param {(t: number) => number} easing - イージング関数（0〜1 → 0〜1）
 */
function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

/**
 * 0 から目標値までイージング付きでアニメーションする値を返すフック（円グラフの進捗などに利用）
 * @param {number} targetValue - 目標値（0〜1 の進捗や任意の数値）
 * @param {number} [duration=1200] - アニメーション時間（ms）
 * @returns {number} 現在のアニメーション中の値
 */
export function useAnimatedValue(targetValue, duration = 1200) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTime = null;
    let rafId = null;

    const animate = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setCurrent(eased * targetValue);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setCurrent(targetValue);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [targetValue, duration]);

  return current;
}

/**
 * 数値を 0 から目標値までアニメーション表示するコンポーネント
 * @param {object} props
 * @param {number} props.value - 表示する目標値
 * @param {number} [props.duration=1200] - アニメーション時間（ms）
 * @param {string} [props.suffix=''] - 数値の後に付ける文字（例: '%', '冊'）
 * @param {string} [props.prefix=''] - 数値の前に付ける文字
 * @param {(n: number) => string} [props.formatter] - 表示用フォーマット関数（指定時は suffix/prefix は無視）
 * @param {number} [props.decimals=0] - 小数桁数（formatter 未使用時）
 */
function CountUp({
  value,
  duration = 1200,
  suffix = '',
  prefix = '',
  formatter,
  decimals = 0,
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    let rafId = null;

    const animate = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = eased * value;
      setDisplayValue(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [value, duration]);

  if (formatter) {
    const rounded =
      decimals > 0
        ? Math.round(displayValue * 10 ** decimals) / 10 ** decimals
        : Math.round(displayValue);
    return <span>{formatter(rounded)}</span>;
  }

  const rounded = Math.round(displayValue * 10 ** decimals) / 10 ** decimals;
  const numStr =
    decimals > 0 ? rounded.toFixed(decimals) : String(Math.round(rounded));
  return (
    <span>
      {prefix}
      {numStr}
      {suffix}
    </span>
  );
}

export default CountUp;
