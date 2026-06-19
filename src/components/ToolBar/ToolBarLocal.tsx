import React, { useLayoutEffect, useMemo, useState } from 'react';
import { AppBar, Grid, Toolbar, Typography, useMediaQuery } from "@mui/material";
import styles from './styles';
import AppBarStyled from 'layout/Main/Header/AppbarStyled';
import { useGetMenuMaster } from 'hooks/useMenu';
import { HEADER_HEIGHT, TOOLBAR_HEIGHT } from 'themes/config';
import { actionButtons, IAction, IActionAndSub, IToolbarButton } from 'types';
import { findItemInArray } from 'utils';
import { Button } from 'components';
import Icons, { IconName } from 'assets/Icon';
import IconButton from 'components/@extended/IconButton';
import ButtonMenu from './ButtonMenu';

export interface ToolBarLocalProps {
  title?: string;
  buttons?: (IToolbarButton | IAction)[];
  handleButtonClick?: (action: IAction | IActionAndSub) => void;
}
const ToolBarLocal = ({
  title,
  buttons = [],
  handleButtonClick,
}: ToolBarLocalProps) => {
  const iconSize = 14;

  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'))
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const actionsRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);

  const items = useMemo(() => {
    return buttons.map((button) => {
      if (typeof button === "string") {
        const i = findItemInArray(actionButtons, button);
        return { ...i };
      } else {
        return { ...button };
      }
    });
  }, [buttons]);

  const normalButton = items.filter(btn => btn.key !== "more");
  const moreButton = items.find(btn => btn.key === "more");

  const [visibleCount, setVisibleCount] = useState(items.length);
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ro = new ResizeObserver(() => {
      if (!containerRef.current || !titleRef.current) return;

      const containerW = containerRef.current.offsetWidth;
      const titleW = titleRef.current.offsetWidth;


      const available = containerW - titleW - 200; // buffer
      let used = 0;
      let count = 0;

      const nodes = actionsRef.current?.childNodes || [];

      nodes.forEach(node => {
        used += node.offsetWidth;

        if (used <= available) count++;
      });

      const nextCount = Math.max(0, count);
      setVisibleCount((prevCount) => (prevCount === nextCount ? prevCount : nextCount));
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [items, drawerOpen, downLG]);

  const visible = normalButton.slice(0, visibleCount);
  const hidden = normalButton.slice(visibleCount);

  const getButtonKey = (button: IToolbarButton, idx: number) => {
    return `${button.key}-${idx}`;
  };

  const mainTBarLocal = (
    <Toolbar sx={{ ...styles.toolbar, minHeight: `${TOOLBAR_HEIGHT}px` }}>
      <Grid ref={containerRef} container sx={{ ...styles.gridContainer }}>
        <Grid sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h4" ref={titleRef}>{title}</Typography>
        </Grid>
        <Grid sx={{ ...styles.buttons, visibility: 'hidden', position: 'absolute' }} ref={actionsRef}>
          {items.map((button, idx) => {
            const buttonKey = getButtonKey(button, idx);
            if (button.items?.length > 0) {
              return (
                <ButtonMenu
                  icon={Icons({ name: button.icon, size: iconSize })}
                  type={button.type ?? "button"}
                  key={buttonKey}
                  label={
                    button.label
                  }
                  items={button.items}
                  handleActionClick={handleButtonClick}
                  actionKey={button.key}
                />
              )
            } else {
              return button.label === "" || button.label === null ? (
                <IconButton
                  key={buttonKey}
                  sx={{ bgcolor: "transparent", '&:hover': { bgcolor: "transparent" }, }}
                  onClick={() => {
                    handleButtonClick?.(button.key);
                  }}
                >
                  {Icons({ name: button.icon, size: iconSize })}
                </IconButton>
              ) : (
                <Button
                  key={buttonKey}
                  variant={button.key === IAction.CANCEL ? "outlined" : "contained"}
                  type={button.type ?? "button"}
                  startIcon={<Icons name={button.icon} size={14} color={button.key === IAction.CANCEL ? 'text.primary' : 'white'} />}
                  text={
                    button.label
                  }
                  onClick={() => {
                    handleButtonClick?.(button.key);
                  }}
                />
              );
            }
          })}
        </Grid>
        <Grid sx={{ ...styles.buttons }}>
          {visible.map((button, idx) => {
            const buttonKey = getButtonKey(button, idx);
            if (button.items?.length > 0) {
              return (
                <ButtonMenu
                  icon={Icons({ name: button.icon, size: iconSize })}
                  type={button.type ?? "button"}
                  key={buttonKey}
                  actionKey={button.key}
                  label={
                    button.label
                  }
                  handleActionClick={handleButtonClick}
                  items={button.items}
                />
              )
            } else {
              return button.label === "" || button.label === null ? (
                <IconButton
                  key={buttonKey}
                  sx={{ bgcolor: "transparent", '&:hover': { bgcolor: "transparent" }, }}
                  onClick={() => {
                    handleButtonClick?.(button.key);
                  }}
                >
                  {Icons({ name: button.icon, size: iconSize })}
                </IconButton>
              ) : (
                <Button
                  key={buttonKey}
                  variant={button.key === IAction.CANCEL ? "outlined" : "contained"}
                  type={button.type ?? "button"}
                  startIcon={<Icons name={button.icon} size={14} color={button.key === IAction.CANCEL ? 'text.primary' : 'white'} />}
                  text={
                    button.label
                  }
                  onClick={() => {
                    handleButtonClick?.(button.key);
                  }}
                />
              );
            }
          })}
          {(moreButton || hidden.length > 0) && (
            <ButtonMenu
              icon={Icons({ name: IconName.MORE, size: iconSize })}
              type={"button"}
              actionKey={IAction.MORE}
              items={[...hidden, ...(moreButton ? moreButton.items : [])]}
              handleActionClick={handleButtonClick}
            />
          )}
        </Grid>
      </Grid>
    </Toolbar>
  )
  const appBar = {
    position: 'fixed' as const,
    color: 'inherit' as const,
    elevation: 1,
    sx: {
      zIndex: 1199,
      marginTop: `${HEADER_HEIGHT}px`,
      //   width: { xs: '100%', lg: sideBarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : `calc(100% - ${MINI_DRAWER_WIDTH}px)` },
      boxShadow: 'inherit',
    }
  };
  return (
    <>
      {!downLG ? (
        <AppBarStyled open={drawerOpen} {...appBar}>
          {mainTBarLocal}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainTBarLocal}</AppBar>
      )}
    </>
  );
}

export default ToolBarLocal