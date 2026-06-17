import PropTypes from 'prop-types';
import { Link, useLocation, matchPath } from 'react-router-dom';
import React from 'react';
// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import createStyles from './styles';
// project imports
import IconButton from 'components/@extended/IconButton';

import { handlerDrawerOpen, handlerSelectedCollapse, handlerSelectedMenu, useGetMenuMaster } from 'hooks/useMenu';
import { useTranslation } from 'react-i18next';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //
interface NavItemProps {
  item: any;
  level: number;
  isChild?: boolean;
}
export default function NavItem({ item, level, isChild = false }: NavItemProps) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;
  const selectedMenu = menuMaster?.selectedMenu;
  const styles = createStyles();
  const { t } = useTranslation();

  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));


  const itemHandler = () => {
    if (downLG) handlerDrawerOpen(false);
    handlerSelectedMenu(item.id);
    !isChild && handlerSelectedCollapse('');
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

  const { pathname } = useLocation();
  const itemPath = item?.link ? item.link : item.url;
  const isRootPath = itemPath === '/';
  const isMatchedPath = itemPath ? !!matchPath({ path: itemPath, end: isRootPath }, pathname) : false;
  const isFallbackSelected = !itemPath && selectedMenu === item.id;
  const isSelected = isMatchedPath || isFallbackSelected;

  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';

  const itemButton = (
    <ListItemButton
      component={Link}
      to={item.url}
      disabled={item.disabled}
      selected={isSelected}
      sx={() => styles.listItemButton({ drawerOpen, level })}
      onClick={() => itemHandler()}
    >
      {itemIcon && (
        <ListItemIcon
          sx={() => (styles.listItemIcon({ drawerOpen, isSelected }))}
        >
          {itemIcon}
        </ListItemIcon>
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && (
        <ListItemText
          primary={
            <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }}>
              {t(`form.${item.title}`)}
            </Typography>
          }
        />
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        {!drawerOpen && level === 1 ? (
          <Tooltip 
            title={t(`form.${item.title}`)} 
            placement="right"
            slotProps={{
              tooltip: {
                sx: {
                  color: 'text.primary',
                  bgcolor: 'background.paper',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                  border: '1px solid',
                  borderColor: 'divider',
                  fontWeight: 500
                }
              }
            }}
          >
            {itemButton}
          </Tooltip>
        ) : (
          itemButton
        )}
        {(drawerOpen || (!drawerOpen && level !== 1)) &&
          item?.actions &&
          item?.actions.map((action, index) => {
            const ActionIcon = action.icon;
            const callAction = action?.function;
            return (
              <IconButton
                key={index}
                {...(action.type === 'function' && {
                  onClick: (event) => {
                    event.stopPropagation();
                    callAction();
                  }
                })}
                {...(action.type === 'link' && {
                  component: Link,
                  to: action.url,
                  target: action.target ? '_blank' : '_self'
                })}
                color="secondary"
                variant="outlined"
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 20,
                  zIndex: 1202,
                  width: 20,
                  height: 20,
                  mr: -1,
                  ml: 1,
                  color: 'secondary.dark',
                  borderColor: isSelected ? 'primary.light' : 'secondary.light',
                  '&:hover': { borderColor: isSelected ? 'primary.main' : 'secondary.main' }
                }}
              >
                <ActionIcon style={{ fontSize: '0.625rem' }} />
              </IconButton>
            );
          })}
      </Box>
    </>
  );
}

NavItem.propTypes = {
  item: PropTypes.any,
  level: PropTypes.number,
  isParents: PropTypes.bool,
  setSelectedID: PropTypes.oneOfType([PropTypes.any, PropTypes.func])
};
