import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './useLoop';

type RollingNumberProps = {
  base?: number;
  minIncrement?: number;
  maxIncrement?: number;
  interval?: number;
  className?: string;
};

/**
 * 持续滚动的数字：从 base 开始，每隔 interval 随机增长一段。
 * 系统减弱动效时定格在 base。
 */
export default function RollingNumber({
  base = 0,
  minIncrement = 1,
  maxIncrement = 5,
  interval = 2000,
  className,
}: RollingNumberProps) {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(base);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (reduced) return;
    timerRef.current = setInterval(() => {
      setValue((prev) => prev + Math.floor(Math.random() * (maxIncrement - minIncrement + 1)) + minIncrement);
    }, interval);
    return () => clearInterval(timerRef.current);
  }, [reduced, interval, minIncrement, maxIncrement]);

  // 外部 base 变化时重置
  useEffect(() => {
    setValue(base);
  }, [base]);

  return <span className={className}>{reduced ? base : value}</span>;
}