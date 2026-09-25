import { useEffect, useState } from 'react';

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
  const [progress, setProgress] = useState({ text, active, count: 0 });

  /**
   * @wisepen-manual-effect
   * 执行时机：text/speed/active 变化时启动或停止打字机计时器。
   * 不可替代原因：打字机必须逐字定时推进，setInterval 是唯一可靠的时序来源。
   * cleanup：清除计时器。
   */
  useEffect(() => {
    if (!active || !text) return;

    const timer = setInterval(() => {
      setProgress((previous) => {
        const count = previous.text === text && previous.active === active ? previous.count + 1 : 1;
        if (count >= text.length) clearInterval(timer);
        return { text, active, count: Math.min(count, text.length) };
      });
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, active]);

  return active && progress.active && progress.text === text ? progress.count : 0;
}
