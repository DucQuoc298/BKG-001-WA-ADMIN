import React, { useLayoutEffect, useMemo, useState } from "react";
import { Box, IconButton, Menu, MenuItem, Stack } from "@mui/material";
import Icons, { IconName } from "assets/Icon";
import { Button } from "components/Buttons";
import { SearchField } from "components/Inputs";
import { IAction, IActionAndSub, IToolbarButton } from "types";
import { useTranslation } from "react-i18next";
import { MdMoreVert } from "react-icons/md";

interface IActionBar {
  buttons: IToolbarButton[];
  onButtonClick?: (actionKey: IAction | IActionAndSub) => void;
  searchField?: boolean;
  filterButton?: boolean;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}

const ActionBar = ({
  buttons,
  onButtonClick,
  onSearchChange,
  searchValue,
}: IActionBar) => {

  const { t } = useTranslation();

  // --- Responsive collapse logic (same pattern as ToolBarLocal) ---
  const containerRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(buttons.length);

  useLayoutEffect(() => {
    if (!containerRef.current || !measureRef.current) return;

    const ro = new ResizeObserver(() => {
      if (!containerRef.current || !measureRef.current) return;

      const containerW = containerRef.current.offsetWidth;
      // Reserve space for the right-side search + filter section (~300px) and the "more" icon (~40px)
      const available = containerW - 360;
      let used = 0;
      let count = 0;

      const nodes = measureRef.current.childNodes as NodeListOf<HTMLElement>;
      nodes.forEach((node) => {
        used += node.offsetWidth;
        if (used <= available) count++;
      });

      // If all buttons fit, show them all. Otherwise, hide at least 2
      // (since the "Actions" dropdown itself takes space like a button).
      const total = buttons.length;
      const nextCount = count >= total ? total : Math.max(0, Math.min(count, total - 2));
      setVisibleCount((prev) => (prev === nextCount ? prev : nextCount));
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [buttons]);

  const visible = useMemo(() => buttons.slice(0, visibleCount), [buttons, visibleCount]);
  const hidden = useMemo(() => buttons.slice(visibleCount), [buttons, visibleCount]);

  // --- "More" dropdown state ---
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const renderButton = (button: IToolbarButton, idx: number) => (
    <Button
      variant="text"
      key={`action-${button.key}-${idx}`}
      text={button.label ?? t(`button.${button.key}`)}
      onClick={() => {
        onButtonClick?.(button.key);
      }}
      startIcon={
        button.icon
          ? <Icons name={button.icon} size={12} />
          : undefined
      }
      color={button.key === IAction.DELETE ? 'error' : (button.color ?? 'primary') as any}
      sx={{ whiteSpace: 'nowrap' }}
    />
  );

  return (
    <Stack ref={containerRef} direction="row" spacing={1} sx={{ my: 1, justifyContent: 'space-between' }}>
      {/* Hidden measure layer — renders all buttons offscreen to measure widths */}
      <Box
        ref={measureRef}
        sx={{ display: 'flex', visibility: 'hidden', position: 'absolute', pointerEvents: 'none', overflow: 'hidden', height: 0 }}
      >
        {buttons.map((button, idx) => renderButton(button, idx))}
      </Box>

      {/* Visible buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {visible.map((button, idx) => renderButton(button, idx))}
        {hidden.length > 0 && (
          <>
            <Button
              variant="text"
              text="Actions"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              startIcon={<MdMoreVert size={18} />}
            />
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={() => setAnchorEl(null)}
              sx={{ mt: 1 }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {hidden.map((button) => (
                <MenuItem
                  key={`more-${button.key}`}
                  sx={{ mx: 1, gap: 1, fontSize: 14 }}
                  onClick={() => {
                    setAnchorEl(null);
                    onButtonClick?.(button.key);
                  }}
                >
                  {button.icon && <Icons name={button.icon} size={14} />}
                  {button.label ?? t(`button.${button.key}`)}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Box>

      {/* Search + Filter */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SearchField value={searchValue} onSearchChange={(value) => {
          onSearchChange?.(value ?? "")
        }} />
        <IconButton onClick={() => { console.log("filter") }}>
          <Icons name={IconName.FILTER} size={16} />
        </IconButton>
      </Box>
    </Stack>
  )
}

export default ActionBar;