import React, { useLayoutEffect, useMemo, useState } from "react";
import { Box, IconButton, Menu, MenuItem, Stack, Tooltip } from "@mui/material";
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
  onFilterClick?: () => void;
  searchValue?: string;
}

type DisplayMode = 'full' | 'compact' | 'overflow';

const ActionBar = ({
  buttons,
  onButtonClick,
  onSearchChange,
  onFilterClick,
  searchValue,
}: IActionBar) => {

  const { t } = useTranslation();

  // --- Responsive collapse logic ---
  const containerRef = React.useRef<HTMLDivElement>(null);
  const measureFullRef = React.useRef<HTMLDivElement>(null);
  const measureCompactRef = React.useRef<HTMLDivElement>(null);

  const [displayMode, setDisplayMode] = useState<DisplayMode>('full');
  const [visibleCount, setVisibleCount] = useState(buttons.length);

  useLayoutEffect(() => {
    if (!containerRef.current || !measureFullRef.current || !measureCompactRef.current) return;

    const ro = new ResizeObserver(() => {
      if (!containerRef.current || !measureFullRef.current || !measureCompactRef.current) return;

      const containerW = containerRef.current.offsetWidth;
      const reserved = 260;
      const available = containerW - reserved;
      const total = buttons.length;

      // 1. Try full mode (icon + text)
      let fullUsed = 0;
      let fullCount = 0;
      const fullNodes = measureFullRef.current.childNodes as NodeListOf<HTMLElement>;
      fullNodes.forEach((node) => {
        fullUsed += node.offsetWidth;
        if (fullUsed <= available) fullCount++;
      });

      if (fullCount >= total) {
        setDisplayMode('full');
        setVisibleCount(total);
        return;
      }

      // 2. Try compact mode (icon only)
      let compactUsed = 0;
      let compactCount = 0;
      const compactNodes = measureCompactRef.current.childNodes as NodeListOf<HTMLElement>;
      compactNodes.forEach((node) => {
        compactUsed += node.offsetWidth;
        if (compactUsed <= available) compactCount++;
      });

      if (compactCount >= total) {
        setDisplayMode('compact');
        setVisibleCount(total);
        return;
      }
      const nextCount = Math.max(0, Math.min(compactCount, total - 2));
      setDisplayMode('overflow');
      setVisibleCount(nextCount);
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [buttons]);

  const visible = useMemo(() => buttons.slice(0, visibleCount), [buttons, visibleCount]);
  const hidden = useMemo(() => buttons.slice(visibleCount), [buttons, visibleCount]);

  // --- "More" dropdown state ---
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const getButtonLabel = (button: IToolbarButton) => button.label ?? t(`button.${button.key}`);
  const getButtonColor = (button: IToolbarButton) =>
    button.key === IAction.DELETE ? 'error' : (button.color ?? 'primary');

  // Full button: icon + text
  const renderFullButton = (button: IToolbarButton, idx: number) => (
    <Button
      variant="text"
      key={`action-${button.key}-${idx}`}
      text={getButtonLabel(button)}
      onClick={() => onButtonClick?.(button.key)}
      startIcon={
        button.icon ? <Icons name={button.icon} size={12} /> : undefined
      }
      color={getButtonColor(button) as any}
      sx={{ whiteSpace: 'nowrap' }}
    />
  );

  // Compact button: icon only with tooltip
  const renderCompactButton = (button: IToolbarButton, idx: number) => (
    <Tooltip title={getButtonLabel(button)} key={`compact-${button.key}-${idx}`}>
      <IconButton
        size="small"
        onClick={() => onButtonClick?.(button.key)}
        color={getButtonColor(button) as any}
        sx={{ mx: 0.25 }}
      >
        {button.icon
          ? <Icons name={button.icon} size={16} />
          : <span style={{ fontSize: 12, fontWeight: 500 }}>{getButtonLabel(button).charAt(0)}</span>
        }
      </IconButton>
    </Tooltip>
  );

  return (
    <Stack ref={containerRef} direction="row" spacing={1} sx={{ my: 1, justifyContent: 'space-between' }}>
      {/* Hidden measure layer — full buttons (icon + text) */}
      <Box
        ref={measureFullRef}
        sx={{ display: 'flex', visibility: 'hidden', position: 'absolute', pointerEvents: 'none', overflow: 'hidden', height: 0 }}
      >
        {buttons.map((button, idx) => renderFullButton(button, idx))}
      </Box>

      {/* Hidden measure layer — compact buttons (icon only) */}
      <Box
        ref={measureCompactRef}
        sx={{ display: 'flex', visibility: 'hidden', position: 'absolute', pointerEvents: 'none', overflow: 'hidden', height: 0 }}
      >
        {buttons.map((button, idx) => renderCompactButton(button, idx))}
      </Box>

      {/* Visible buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {displayMode === 'full' && visible.map((button, idx) => renderFullButton(button, idx))}
        {displayMode !== 'full' && visible.map((button, idx) => renderCompactButton(button, idx))}
        {hidden.length > 0 && (
          <>
            <IconButton
              size="small"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ mx: 0.25 }}
            >
              <MdMoreVert size={18} />
            </IconButton>
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
                  {getButtonLabel(button)}
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
        {onFilterClick && (
          <IconButton onClick={onFilterClick}>
            <Icons name={IconName.FILTER} size={16} />
          </IconButton>
        )}
      </Box>
    </Stack>
  )
}

export default ActionBar;