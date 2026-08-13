import { useEffect, useRef, useState } from 'react';

/**
 * 从最近的 [data-demo] 父元素读取 data-step 属性。
 * 替代独立 useLoop，确保与 DemoPlayer 的 step 完全同步。
 * 当 DemoPlayer 被 IO 暂停时，组件也同步暂停。
 * @returns [ref, step] — ref 需挂到组件根元素上
 */
export function useDemoStep(): [React.RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  /**
   * @wisepen-manual-effect
   * 执行时机：挂载时注册 MutationObserver 监听最近的 [data-demo] 父元素的 data-step 属性变化。
   * 不可替代原因：data-step 属性由 DemoPlayer 控制，只能通过 MutationObserver 感知变化。
   * cleanup：断开观察器。
   */
  useEffect(() => {
    const el = ref.current?.closest('[data-demo]') as HTMLElement | null;
    if (!el) return;

    const update = () => setStep(Number(el.getAttribute('data-step')) || 0);
    update();

    const mo = new MutationObserver(update);
    mo.observe(el, { attributes: true, attributeFilter: ['data-step'] });
    return () => mo.disconnect();
  }, []);

  return [ref, step];
}