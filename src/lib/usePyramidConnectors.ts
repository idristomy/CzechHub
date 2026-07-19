"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ConnectorLine = { x1: number; y1: number; x2: number; y2: number };

/**
 * Measures the real positions of an "apex" card (MCP / LCP) and a dynamic list
 * of child cards (MCVPs / LCVPs), then returns one connector line per child —
 * from the apex's bottom-centre to each child's top-centre.
 *
 * Because the lines are derived from the actually-rendered cards, there is never
 * a dangling line: add a card in the admin and a line appears, remove one and it
 * disappears. Uses layout offsets (not getBoundingClientRect) so hover/scale
 * animations on the cards don't distort the anchor points.
 */
export function usePyramidConnectors(count: number) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const apexRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [lines, setLines] = useState<ConnectorLine[]>([]);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const apex = apexRef.current;
    if (!container || !apex) {
      setLines([]);
      return;
    }
    // Position of an element relative to the container, summed up the offset
    // chain so intermediate positioned wrappers are accounted for and CSS
    // transforms (hover/scale) are ignored.
    const within = (el: HTMLElement) => {
      let x = 0;
      let y = 0;
      let node: HTMLElement | null = el;
      while (node && node !== container) {
        x += node.offsetLeft;
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return { x, y };
    };
    const a = within(apex);
    const ax = a.x + apex.offsetWidth / 2;
    const ay = a.y + apex.offsetHeight;
    const next: ConnectorLine[] = [];
    for (let i = 0; i < count; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const p = within(el);
      next.push({ x1: ax, y1: ay, x2: p.x + el.offsetWidth / 2, y2: p.y });
    }
    setLines(next);
  }, [count]);

  useEffect(() => {
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => measure()) : null;
    if (ro && containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 300); // re-measure once fonts/layout settle
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [measure]);

  const setItemRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      itemRefs.current[i] = el;
    },
    []
  );

  return { containerRef, apexRef, setItemRef, lines };
}
