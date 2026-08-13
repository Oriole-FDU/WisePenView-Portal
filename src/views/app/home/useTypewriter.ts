import { useEffect, useRef, useState } from 'react';

/**
 * 打字机效果 hook：逐字渲染文本，支持光标闪烁。
 * @param text 完整文本
 * @param speed 每字间隔（ms）
 * @param active 是否激活（暂停/循环结束时停止）
 * @returns 当前已渲染的字符数
 */
export function useTypewriter(
  text: string,
  speed: number = 30,
  active: boolean = true
): number {
  const [count, setCount] = useState(0);
  const idxRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const doneRef = useRef(false);

  /**
   * @wisepen-manual-effect
   * 执行时机：text/speed/active 变化时启动或停止打字机计时器。
   * 不可替代原因：打字机必须逐字定时推进，setInterval 是唯一可靠的时序来源。
   * cleanup：清除计时器。
   */
  useEffect(() => {
    // 无文本或未激活时冻结当前进度（不跳到全文），由外部阶段决定何时展示完整态
    if (!active || !text) {
      if (!text) { setCount(0); doneRef.current = false; }
      return;
    }

    // 如果之前已打完，直接显示全文，不再重置重打
    if (doneRef.current) {
      setCount(text.length);
      return;
    }

    idxRef.current = 0;
    setCount(0);

    timerRef.current = setInterval(() => {
      idxRef.current += 1;
      if (idxRef.current >= text.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setCount(text.length);
        doneRef.current = true;
        return;
      }
      setCount(idxRef.current);
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      // 每次 active 变化（循环回到 step0 或离开视口暂停）都清除完成标记，
      // 使下一次激活时重新打字，实现"每次循环重打"
      doneRef.current = false;
    };
  }, [text, speed, active]);

  return count;
}