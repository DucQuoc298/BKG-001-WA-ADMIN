import { ISectionTab } from "types";
import SideIndex from "./SideIndex";
import React, { useCallback, useRef } from "react";
import { Box } from "@mui/material";
import styles from "./styles";


interface IScrollIndexLayout {
  items: ISectionTab[];
  stickyTop?: number;
  children: React.ReactNode;
}

const ScrollIndexLayout = ({ items, stickyTop = 114, children }: IScrollIndexLayout) => {
  const [activeId, setActiveId] = React.useState(items[0].id);
  const isScrollingRef = useRef(false);
  const timerRef = useRef<any>(null);

  const handleSelect = useCallback((id) => {
    isScrollingRef.current = true;
    setActiveId(id);

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Sau khi scroll xong (~600ms) mới để IntersectionObserver tiếp quản
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 700);
  }, []);

  // IntersectionObserver: tự động highlight tab khi scroll bằng chuột/tay
  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isScrollingRef.current) {
            setActiveId(id);
          }
        },
        { threshold: 0.4 }
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
  }, [items]);

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


