import PropTypes from 'prop-types';
import { Link, useLocation, matchPath } from 'react-router-dom';
import React, { useCallback, useRef, useState } from 'react';
// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import IconButton from 'components/@extended/IconButton';

import { handlerDrawerOpen, handlerSelectedCollapse, handlerSelectedMenu, useGetMenuMaster } from 'api/menu';
import { ISideBarMenuItem } from 'menu-items';
import { ClickAwayListener, Collapse, List, Paper, Popper, Tooltip } from '@mui/material';
import NavItem from '../NavItem';
import { ExpandMore, KeyboardArrowDownOutlined, KeyboardArrowRightOutlined } from '@mui/icons-material';
import createStyles from './styles';
import Transitions from 'components/@extended/Transitions';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //
interface NavCProps {
  item: any;
  level: number;
  isParents?: boolean;
}
export default function NavCollapse({ item, level }: NavCProps) {
  const styles = createStyles();
  const { menuMaster } = useGetMenuMaster();
  const {
    isDashboardDrawerOpened: drawerOpen,
    selectedMenu,
    selectedCollapse
  } = menuMaster || {};

  const ref = useRef<HTMLSpanElement>(null);
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [anchorEl, setAnchorEl] = useState(null);

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  const itemHandler = useCallback((event) => {
    if (downLG) handlerDrawerOpen(false);
    handlerSelectedCollapse(isOpenCollapse ? '' : item.id);
    console.log(anchorEl);
    if (!drawerOpen) {
      if(anchorEl) {
        setAnchorEl(null);
      }else setAnchorEl(event?.currentTarget);
      !isOpenCollapse && setAnchorEl(event?.currentTarget);
      if(!item.children?.includes((child) => child.id === selectedMenu)) {
        handlerSelectedMenu(isSelected ? '' : item.id);
      }
    }
  }, [downLG, drawerOpen, item.id, item.children, selectedMenu, anchorEl]);

  const handleClosePopper = () => {
    item.children?.map((child) => {
      if (child.id !== selectedMenu) {
        handlerSelectedMenu('');
      }
    });
    console.log('close popper');
    setAnchorEl(null);
  };

  const Icon = item.icon;
  const itemIcon = item.icon ? (
    <Icon
      style={{
        fontSize: drawerOpen ? '1rem' : '1.25rem',
      }}
    />
  ) : (
    false
  );

  const isSelected = !drawerOpen ? selectedCollapse === item.id || item.children?.includes((child) => child.id === selectedMenu) : selectedCollapse === item.id && item.children?.includes((child) => child.id === selectedMenu);
  const isOpenCollapse = selectedCollapse === item.id;
  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';


  const menus = item.children?.map((item) => {
  switch (item.type) {
    case 'collapse':
      return <NavCollapse key={item.id} item={item} level={level + 1} />;
    case 'item':
      return <NavItem key={item.id} item={item} level={level + 1} isChild={true} />;
  }
});
  return (
   <>
      <Box sx={{ position: 'relative' }}>
        <ListItemButton
          disableRipple
          disabled={item.disabled}
          selected={isSelected}
          sx={(theme) => ({
            zIndex: 1201,
            pl: drawerOpen ? `${level * 28}px` : 1.5,
            py: !drawerOpen && level === 1 ? 1.25 : 1,
            ...(drawerOpen && {
              '&:hover': { bgcolor: 'primary.lighter' },
              '&.Mui-selected': {
                bgcolor: 'primary.lighter',
                borderRight: '2px solid',
                borderColor: 'primary.main',
                color: iconSelectedColor,
                '&:hover': { color: iconSelectedColor, bgcolor: 'primary.lighter' }
              }
            }),
            ...(!drawerOpen && {
              '&:hover': { bgcolor: 'transparent' },
              '&.Mui-selected': { '&:hover': { bgcolor: 'transparent' }, bgcolor: 'transparent' }
            })
          })}
          onClick={(event) => itemHandler(event)}
        >
          {itemIcon && (
            <ListItemIcon
              sx={(theme) => ({
                minWidth: 28,
                color: isSelected ? iconSelectedColor : textColor,
                ...(!drawerOpen && {
                  borderRadius: 1.5,
                  width: 36,
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': { bgcolor: 'secondary.lighter' }
                }),
                ...(!drawerOpen &&
                  isSelected && {
                    bgcolor: 'primary.lighter',
                    '&:hover': { bgcolor: 'primary.lighter' }
                  })
              })}
            >
              {itemIcon}
            </ListItemIcon>
          )}
          {(drawerOpen || (!drawerOpen && level !== 1)) && (<>
            <ListItemText
              primary={
                <Typography
                  ref={ref}
                  noWrap
                  variant={'body1'}
                  sx={{ color: isSelected ? iconSelectedColor : textColor }}
                >
                  {item.title}
                </Typography>
              }
              secondary={
                item.caption && (
                  <Typography
                    gutterBottom
                    // sx={styles.caption}
                  >
                    {item.caption}
                  </Typography>
                )
              }
            />
            {drawerOpen && (
              isSelected ? <KeyboardArrowRightOutlined sx={{color: iconSelectedColor}}/> : 
                <KeyboardArrowDownOutlined sx={{color: isSelected ? iconSelectedColor : textColor}}/>
            )}
          </>
        )}
        </ListItemButton>
        {drawerOpen && (<Collapse in={isOpenCollapse} timeout="auto" unmountOnExit>
            <List
              disablePadding
            >
              {menus}
            </List>
        </Collapse>)}
        {!drawerOpen && (
          <Popper
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            placement="right-start"
            modifiers={[
              {
                name: 'offset',
                options: {
                  offset: [-12, 4]
                }
              }
            ]}
            sx={styles.popper}
            
          >
            {({ TransitionProps }) => (
              <Transitions ref={undefined} in={Boolean(anchorEl)} {...TransitionProps}>
                <Paper sx={styles.popperPaper}>
                  <ClickAwayListener 
                  onClickAway={handleClosePopper} 
                  mouseEvent="onMouseDown"
                  touchEvent="onTouchStart"
                  >
                    <Box>{menus}</Box>
                  </ClickAwayListener>
                </Paper>
              </Transitions>
            )}
          </Popper>
        )}
      </Box>
    </>
  );
}

NavCollapse.propTypes = {
  item: PropTypes.any,
  level: PropTypes.number,
  isParents: PropTypes.bool,
  setSelectedID: PropTypes.oneOfType([PropTypes.any, PropTypes.func])
};
