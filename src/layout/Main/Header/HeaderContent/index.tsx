// material-ui
import Box from '@mui/material/Box';

// project imports
import Profile from './Profile';
import Notification from './Notification';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { addOpenedFormTab, handlerActiveForm, handlerFormOpened, OpenedFormTab, removeOpenedFormTab, useFormActions, useGetMenuMaster } from 'hooks';
import { Menu, MenuItem, Stack } from '@mui/material';
import Icons, { IconName } from 'assets/Icon';
import { IFormKey } from 'types';
import { Button } from 'components';
import { ArrowDropDownOutlined } from '@mui/icons-material';

const getTabLabel = (path: string) => {
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments.length > 0 ? segments[segments.length - 1] : '/';
  return lastSegment;
};

export default function HeaderContent() {
  const location = useLocation();
  const { menuMaster } = useGetMenuMaster();
  const { activeForm, openedForm } = menuMaster || {};
  const { resetForm } = useFormActions();
  const { t } = useTranslation();
  const actionsRef = useRef<HTMLDivElement>(null);
  const measureRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const navigate = useNavigate();

  // Sync opened tabs with current location
  useEffect(() => {
    if (location.pathname === '/') {
      openedForm && openedForm.length === 0 && handlerFormOpened([]);
      return;
    }

    const nextTab: OpenedFormTab = {
      path: location.pathname,
      label: getTabLabel(location.pathname.toUpperCase()),
    };

    addOpenedFormTab(nextTab);
    handlerActiveForm(nextTab.label.toUpperCase());

  }, [location.pathname]);

  const [widthMap, setWidthMap] = useState<Record<string, number>>({});
  const [draggingTabPath, setDraggingTabPath] = useState<string | null>(null);
  const sortedOpenedTabs = useMemo(() => openedForm ?? [], [openedForm, t]);
  const isActive = (tab: OpenedFormTab) => activeForm === tab.label;
  const [visible, setVisible] = useState<OpenedFormTab[]>([]);
  const [overflow, setOverflow] = useState<OpenedFormTab[]>([]);

  // Navigate to active form when it changes
  useEffect(() => {
    if (openedForm && activeForm) {
      const activeTab = openedForm.find(tab => tab.label.toUpperCase() === activeForm);
      if (activeTab) {
        navigate(activeTab.path);
      }
    }
  }, [activeForm]);

  // Measure tab widths whenever opened tabs change
  useLayoutEffect(() => {
    const map: Record<string, number> = {};
    sortedOpenedTabs.forEach((i) => {
      const el = measureRefs.current[i.label];
      if (el) map[i.label] = el.offsetWidth;
    });
    setWidthMap(map);
  }, [sortedOpenedTabs]);
  
  // Recalculate visible and overflow tabs on width change or when opened tabs change
  useLayoutEffect(() => {
    if (!actionsRef.current || !measureRefs.current) return;

    const recalculateVisibleTabs = () => {
      if (!actionsRef.current || !measureRefs.current) return;

      const containerW = actionsRef.current.offsetWidth;
      let used = 0;
      const v: OpenedFormTab[] = [];
      sortedOpenedTabs.forEach((i) => {
        const w = widthMap[i.label] ?? 0;
        if (used + w <= containerW - 10) {
          v.push(i);
          used += w;
        }
      });
      setVisible(v);
      setOverflow(sortedOpenedTabs.filter((tab) => !v.includes(tab)));
    };

    const ro = new ResizeObserver(() => {
      recalculateVisibleTabs();
    });

    ro.observe(actionsRef.current);
    if (actionsRef.current.parentElement) {
      ro.observe(actionsRef.current.parentElement);
    }
    recalculateVisibleTabs();

    return () => ro.disconnect();
  }, [sortedOpenedTabs, widthMap]);

  // Handlers for tab actions
  const handleActiveButton = (tab: OpenedFormTab) => () => {
    handlerActiveForm(tab.label.toUpperCase() as IFormKey);
  };

  // Reorder tabs when dragged and dropped
  const reorderOpenedTabs = (sourcePath: string, targetPath: string) => {
    if (!openedForm || sourcePath === targetPath) return;

    const nextTabs = [...openedForm];
    const fromIndex = nextTabs.findIndex((tab) => tab.path === sourcePath);
    const toIndex = nextTabs.findIndex((tab) => tab.path === targetPath);

    if (fromIndex < 0 || toIndex < 0) return;

    const [movedTab] = nextTabs.splice(fromIndex, 1);
    nextTabs.splice(toIndex, 0, movedTab);
    handlerFormOpened(nextTabs);
  };

  // Drag and drop handlers
  const handleDragStart = (tab: OpenedFormTab) => (e: React.DragEvent<HTMLButtonElement>) => {
    setDraggingTabPath(tab.path);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', tab.path);
  };

  // Allow dropping by preventing default behavior
  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle dropping a tab onto another to reorder
  const handleDrop = (targetTab: OpenedFormTab) => (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const sourcePath = draggingTabPath ?? e.dataTransfer.getData('text/plain');
    if (!sourcePath) return;

    reorderOpenedTabs(sourcePath, targetTab.path);
    setDraggingTabPath(null);
  };

  // Reset dragging state when drag ends
  const handleDragEnd = () => {
    setDraggingTabPath(null);
  };
  // Handlers for "More" menu actions
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // Open the "More" menu when the button is clicked
  const handleClickMore = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  // Close the "More" menu
  const handleCloseMore = () => {
    setAnchorEl(null);
  };
  // Handle closing a tab when the close icon is clicked
  const handleClosePath = (e: React.MouseEvent<HTMLElement|SVGSVGElement>, tab: OpenedFormTab) => {
    e.stopPropagation();
    const formKey = tab.label;

    if (formKey) {
      resetForm(formKey);
    }

    if(openedForm !== undefined && openedForm.length === 1){
      if(activeForm === IFormKey.HOME) return;
        handlerActiveForm(IFormKey.HOME);
        handlerFormOpened([{ path: 'home', label: 'home' }]);
        return;
    }
    removeOpenedFormTab(tab.path);
    // xoá data liên quan đến form đang đóng nếu có
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // Render the tab buttons and the "More" menu
  const ButtonTabs = useMemo(() => {
    return visible.map((tab) => (
      <Box 
        key={tab.path} 
        component="button"
        draggable
        onClick={handleActiveButton(tab)}
        onDragStart={handleDragStart(tab)}
        onDragOver={handleDragOver}
        onDrop={handleDrop(tab)}
        onDragEnd={handleDragEnd}
        sx={{
          ...styles.tabButton,
          opacity: draggingTabPath === tab.path ? 0.55 : 1,
          ...(isActive(tab) ? styles.activeTabButton : {}),
        }}>
        {t(`form.${tab.label.toUpperCase()}` as keyof typeof t)}
        <Box className="tab-close-icon" sx={styles.closeIcon} onClick={(e) => handleClosePath(e, tab)}>
          <Icons name={IconName.CLOSE} size={14} />
        </Box>
      </Box>
    ));
  }, [visible, isActive, t, activeForm, openedForm, widthMap, draggingTabPath]);

  return (
    <>
      <Box sx={{...styles.tabContainer, position: 'relative'}}>
        <Stack
          ref={actionsRef}
          sx={{
            ...styles.wrapper,
            width: 'auto',
            display: 'flex',
            flexGrow: 1,
            gap: 0.25,
          }}
          direction={"row"}
        >
          {ButtonTabs}
          {overflow.length > 0 && (
            <Box>
              <Button
                variant="text"
                endIcon={<ArrowDropDownOutlined/>}
                sx={styles.btnMore}
                text={`+${overflow.length}`}
                onClick={handleClickMore}
              />
              <Menu
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleCloseMore}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {overflow.map((item, _index) => {
                  const formText = t(`form.${item.label.toUpperCase()}` as keyof typeof t);
                  return (
                    <MenuItem
                      key={item.label}
                      id={item.label}
                      onClick={() => {
                        handleActiveButton(item)()
                        handleCloseMore();
                      }}
                    >
                      <Button
                      id={item.label}
                      variant="text"
                      sx={{
                        ...styles.btnMenu,
                        backgroundColor: 'transparent',
                      }}
                      text={formText}
                      />
                      <Icons name={IconName.CLOSE} size={14} color="primary.main" onClick={(e) => handleClosePath(e, item)}/>
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>
          )}
        </Stack>

        <Stack
          sx={{
            ...styles.wrapper,
            width: '100%',
            display: 'flex',
            flexGrow: 1,
            gap: 0.25,
            position: 'absolute', 
            top: 50,
            visibility: 'hidden'
          }}
          direction={'row'}
        >
          {sortedOpenedTabs.map((tab) => (
            <Box 
            ref={(el: HTMLButtonElement | null) => {measureRefs.current[tab.label] = el}}
            key={`measure-${tab.path}`} 
            component="button" 
            sx={{
              ...styles.tabButton,
            }}>
              {t(`form.${tab.label.toUpperCase()}` as keyof typeof t)}
              <Box className="tab-close-icon" sx={styles.closeIcon} onClick={(e) => handleClosePath(e, tab)}>
                <Icons name={IconName.CLOSE} size={14} color="primary" onClick={(e) => handleClosePath(e, tab)}/>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 2 }}>
        <Notification />
        <Profile />
      </Box>
    </>
  );
}
