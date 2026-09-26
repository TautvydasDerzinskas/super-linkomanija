import { useEffect, useRef, type ReactNode } from 'react';
import tippy, { type Instance, type Placement } from 'tippy.js';

import 'tippy.js/dist/tippy.css';

interface ITooltipProps {
  title: string;
  position?: Placement;
  children: ReactNode;
}

export default function Tooltip({ title, position = 'top', children }: ITooltipProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<Instance>(null);

  useEffect(() => {
    instanceRef.current = tippy(elementRef.current);
    return () => instanceRef.current.destroy();
  }, []);

  // Runs after the effect above, so it also sets the initial content
  useEffect(() => {
    instanceRef.current.setContent(title);
    instanceRef.current.setProps({ placement: position });
  }, [title, position]);

  return (
    <div ref={elementRef} style={{ display: 'inline' }}>
      {children}
    </div>
  );
}
