import PropTypes from 'prop-types';
import { Link, useLocation, matchPath } from 'react-router-dom';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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


  const isOpenCollapse = selectedCollapse === item.id;
  const isSelected = !drawerOpen ? selectedMenu === item.id || item.children?.some((child) => child.id === selectedMenu) : selectedCollapse !== item.id && item.children?.some((child) => child.id === selectedMenu);
  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';

  const itemHandler = useCallback((event) => {
    if (downLG) handlerDrawerOpen(false);
    
    if (!drawerOpen) {
      //Mở popper nếu collapse chưa mở, đóng nếu collapse đã mở
      anchorEl ? setAnchorEl(null) : setAnchorEl(event?.currentTarget);
      //Nếu collapse chưa mở và menu con không chứa selectedMenu thì setSelectedMenu, ngược lại giữ nguyên selectedMenu
      !isOpenCollapse && setAnchorEl(event?.currentTarget);
    }else{
      handlerSelectedCollapse(isOpenCollapse ? '' : item.id);
    }
  }, [downLG, drawerOpen, item.id, item.children, selectedMenu, anchorEl, isSelected, isOpenCollapse]);

  const handleClickAway = () => {
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


  const menus = item.children?.map((item) => {
  switch (item.type) {
    case 'collapse':
      return <NavCollapse key={item.id} item={item} level={level + 1} />;
    case 'item':
      return <NavItem key={item.id} item={item} level={level + 1} isChild={true} />;
  }
});
const onMouseEnter = (event) => {
  setAnchorEl(event.currentTarget);
};
const onMouseLeave = () => {
  setAnchorEl(null);
}
  return (
   <>
      <Box sx={{ position: 'relative' }}>
        <ListItemButton
          disableRipple
          disabled={item.disabled}
          selected={isSelected}
          {...(!drawerOpen && { onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave })}
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
              isOpenCollapse ? <KeyboardArrowRightOutlined sx={{color: isSelected ? iconSelectedColor : textColor}}/> : 
                <KeyboardArrowDownOutlined sx={{color: isSelected ? iconSelectedColor : textColor}}/>
            )}
          </>
        )}
        {!drawerOpen && (
          <Popper
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            placement="right-start"
            modifiers={[
              {
                name: 'offset',
                options: {
                  offset: [-12, 0]
                }
              }
            ]}
            sx={styles.popper}
            
          >
            {({ TransitionProps }) => (
              <Transitions ref={undefined} in={Boolean(anchorEl)} {...TransitionProps}>
                <Paper sx={styles.popperPaper}>
                  <ClickAwayListener 
                  onClickAway={handleClickAway} 
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
        </ListItemButton>
        {drawerOpen && (<Collapse in={isOpenCollapse} timeout="auto" unmountOnExit>
            <List disablePadding >
              {menus}
            </List>
        </Collapse>)}
        
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
