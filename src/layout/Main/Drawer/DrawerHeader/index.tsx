import PropTypes from 'prop-types';
import React from 'react';
// project imports
import DrawerHeaderStyled from './DrawerHeaderStyled';
import { Link } from 'react-router-dom';
import { APP_DEFAULT_PATH } from 'themes/config';
import { Avatar, ButtonBase, Typography } from '@mui/material';
import Logo from 'assets/images/logo192.png';
import styles from './styles';

// ==============================|| DRAWER HEADER ||============================== //

export default function DrawerHeader({ open }: { open: boolean }) {
  const drawerHeaderStyles = styles();
  return (
    <DrawerHeaderStyled
      open={open}
      sx={{
        minHeight: '60px',
        width: 'initial',
        paddingTop: '8px',
        paddingBottom: '8px',
        paddingLeft: open ? '24px' : 0
      }}
    >
      {/* <Logo isIcon={!open} sx={{ width: open ? 'auto' : 35, height: 35 }} /> */}
      <ButtonBase disableRipple component={Link} to={APP_DEFAULT_PATH} sx={open ? {justifyContent: 'flex-start', maxWidth: 'calc(100% - 40px)'} : {}}>
        <Avatar
          variant="square"
          sx={{...drawerHeaderStyles.avatar, backgroundColor: 'transparent' }}>
            <img alt='logo' src={Logo} style={drawerHeaderStyles.avatarImage} />
          {/* {info && info.avatarCompanyUrl ? (<img src={`${info?.avatarCompanyUrl}`} style={drawerHeaderStyles.avatarImage} />) : cpnName?.charAt(0) || "-"} */}
        </Avatar>
        {open && (
          <Typography
            sx={{...drawerHeaderStyles.companyName, ml: '15px !important'}}>
            Tavico Digital
          </Typography>
        )}
      </ButtonBase>
    </DrawerHeaderStyled>
  );
}

DrawerHeader.propTypes = { open: PropTypes.bool };
