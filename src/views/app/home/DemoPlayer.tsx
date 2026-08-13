import { useEffect, useState } from 'react';
import { useLoop } from './useLoop';

type DemoPlayerProps = {
  /** 目标 demo 容器上的 data-demo 值，例如 'hero'、'ai' */
  target: string;
  /** 每段演出时长（ms），最后一段即「完成/全部可见」终态 */
  steps: number[];
  repeat?: boolean;
  /** 首次启动延迟（ms），与 Reveal 入场动画对齐避免重叠 */
  startDelay?: number;
  /** 终态停留时长（ms），停留结束后循环重演；0 = 终态结束立即循环 */
  repeatDelay?: number;
  /** 幕间淡出时长（ms），循环重演前先让容器整体渐隐再回到 step0 */
  fadeOut?: number;
};

/**
 * 演示循环编排器：给目标容器打 data-step 阶段标记（渲染为空节点，不影响布局），
 * 由 CSS 后代选择器按阶段驱动动画。循环只在视口内运行，离开即暂停；
 * 重新进入视口时 useLoop 会因 paused 变化重新执行 effect，自动从 step0 重新开始。
 * 循环重演前若配置了 fadeOut，会先给容器写 data-fading="true" 触发 CSS 容器级渐隐，
 * 避免 step2→0 瞬间内部元素重新入场造成的闪回。
 * 目标通过 data-demo 属性定位（类名编译后会哈希，不能用 querySelector 匹配类名）。
 */
export default function DemoPlayer({
  target,
  steps,
  repeat = true,
  startDelay = 0,
  repeatDelay = 0,
  fadeOut = 0,
}: DemoPlayerProps) {
  // 无 IntersectionObserver 环境视为始终在视口内，直接让循环运行
  const ioUnavailable = typeof IntersectionObserver === 'undefined';
  const [inView, setInView] = useState(ioUnavailable);
  const [step, fading] = useLoop(steps, { paused: !inView, repeat, startDelay, repeatDelay, fadeOut });

  /**
   * @wisepen-manual-effect
   * 执行时机：挂载时按 data-demo 定位目标并用 IO 跟踪可见性，驱动循环启停。
   * 不可替代原因：循环启停必须随视口可见性变化，IO 是唯一可靠方式。
   * cleanup：断开观察器。
   */
  useEffect(() => {
    if (ioUnavailable) return;
    const el = document.querySelector<HTMLElement>(`[data-demo="${target}"]`);
    if (!el) return;
    const observer = new IntersectionObserver((entries) => setInView(entries[0].isIntersecting), {
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px',
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ioUnavailable, target]);

  /**
   * @wisepen-manual-effect
   * 执行时机：step 变化时把阶段标记写到目标容器。
   * 不可替代原因：演出由 CSS [data-step] 选择器驱动，需直接操作 DOM 属性，不参与渲染。
   * cleanup：无需额外清理（数据属性随 DOM 一起移除）。
   */
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(`[data-demo="${target}"]`);
    if (el) el.setAttribute('data-step', String(step));
  }, [step, target]);

  /**
   * @wisepen-manual-effect
   * 执行时机：fading 变化时写淡出标记，循环重演前让容器整体渐隐。
   * 不可替代原因：CSS [data-fading] 选择器驱动容器级过渡，需直接操作 DOM 属性。
   * cleanup：无需额外清理（数据属性随 DOM 一起移除）。
   */
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(`[data-demo="${target}"]`);
    if (!el) return;
    if (fading) el.setAttribute('data-fading', 'true');
    else el.removeAttribute('data-fading');
  }, [fading, target]);

  return null;
}
