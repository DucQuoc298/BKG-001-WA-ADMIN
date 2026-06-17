import { ISectionTab } from "types";
import SideIndex from "./SideIndex";
import React, { useCallback, useRef } from "react";
import { Box } from "@mui/material";
import styles from "./styles";


interface IScrollIndexLayout {
  items: ISectionTab[];
  stickyTop?: number;
  children: React.ReactNode;
  activeId?: string;
  onActiveIdChange?: (id: string) => void;
  defaultActiveId?: string;
}

const ScrollIndexLayout = ({
  items,
  stickyTop = 114,
  children,
  activeId: controlledActiveId,
  onActiveIdChange,
  defaultActiveId
}: IScrollIndexLayout) => {
  const [internalActiveId, setInternalActiveId] = React.useState(defaultActiveId || items[0]?.id);

  const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;

  const setActiveId = useCallback((id: string) => {
    setInternalActiveId(id);
    onActiveIdChange?.(id);
  }, [onActiveIdChange]);

  const isScrollingRef = useRef(false);
  const timerRef = useRef<any>(null);

  // Scroll to initial active ID on mount if provided
  const initialActiveRef = useRef(controlledActiveId || defaultActiveId);
  const stickyTopRef = useRef(stickyTop);

  React.useEffect(() => {
    const initialActiveId = initialActiveRef.current;
    if (initialActiveId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(initialActiveId);
        if (el) {
          isScrollingRef.current = true;
          const elementPosition = el.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - stickyTopRef.current;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });

          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
          timerRef.current = setTimeout(() => {
            isScrollingRef.current = false;
          }, 150);
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleSelect = useCallback((id) => {
    isScrollingRef.current = true;
    setActiveId(id);

    const el = document.getElementById(id);
    if (el) {
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - stickyTop; // 24px extra margin
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }

    // Sau khi scroll xong (~600ms) mới để IntersectionObserver tiếp quản
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 700);
  }, [stickyTop, setActiveId]);

  // IntersectionObserver: tự động highlight tab khi scroll bằng chuột/tay
  React.useEffect(() => {
    if (controlledActiveId !== undefined) return;

    const observers: IntersectionObserver[] = [];

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isScrollingRef.current && activeId === undefined) {
            setActiveId(id);
          }
        },
        {
          rootMargin: `-${stickyTop}px 0px -75% 0px`,
          threshold: 0
        }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [items, stickyTop, setActiveId, controlledActiveId]);

  return (
    <Box sx={styles.container}>
      <Box sx={{ ...styles.sideIndex, top: stickyTop }}>
        <SideIndex activeId={activeId} onSelect={handleSelect} items={items} />
      </Box>
      <Box sx={styles.content}>
        {children}
      </Box>
    </Box>
  )
}

export default ScrollIndexLayout;


