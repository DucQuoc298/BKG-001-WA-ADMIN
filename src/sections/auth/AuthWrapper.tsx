import PropTypes from 'prop-types';
import React from 'react';
// material-ui
import { Box, Grid, LinearProgress, MenuItem, Popover, Stack, Typography } from '@mui/material';
import AuthCard from './AuthCard';
import { useTranslation } from 'react-i18next';
import { Button } from 'components';
import { ArrowDropDownOutlined, CheckOutlined, DarkModeOutlined, LightModeOutlined } from '@mui/icons-material';
import { FLAG_ICONS } from 'assets/images/icons/flags';
import { ILanguage, IThemeMode } from 'types';
import { useMain } from 'hooks';
import { languages } from 'utils';
import IconButton from 'components/@extended/IconButton';


// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

export default function AuthWrapper({ children }) {
  const { state, setField } = useMain();
  const {t, i18n} = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleChangeLanguage = (lang: ILanguage) => {
    setAnchorEl(null);
    i18n.changeLanguage(lang === ILanguage.VN ? 'vi' : 'en');
    setField('lang', lang === ILanguage.VN ? 'vi' : 'en');
  }
  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* {authLoading && <LinearProgress />} */}
      <Stack sx={{ minHeight: '100vh' }}>
        < Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, gap: 2 }}>
          <IconButton
            onClick={() => setField('themeMode', state.themeMode === IThemeMode.LIGHT ? IThemeMode.DARK : IThemeMode.LIGHT)}
          >
            {state?.themeMode === IThemeMode.LIGHT ?
              <DarkModeOutlined style={{ color: 'black' }}/> :
              <LightModeOutlined style={{ color: 'white'}}/>
            }
          </IconButton>
          <Button
            aria-describedby={id}
            startIcon={<img src={FLAG_ICONS[state.lang === 'vi' ? 'vn' : 'us']} alt={state.lang} width={20} style={{marginRight: 8}}/>}
            endIcon={<ArrowDropDownOutlined fontSize='large' />}
            variant='text'
            sx={{color: 'text.primary'}}
            text={state.lang === 'vi' ? t('languages.VN') : t('languages.EN')}
            onClick={handleClick}
          ></Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            {languages.map((language) => (
              <MenuItem onClick={() => {handleChangeLanguage(language.id)}} key={language.id} sx={{display: 'flex', alignItems: 'center', p: 1, cursor: 'pointer', '&:hover': {backgroundColor: 'action.hover'}}}>
                <img src={FLAG_ICONS[language.id === ILanguage.VN ? 'vn' : 'us']} alt={language.id} width={20} style={{marginRight: 8}} />
                <Typography variant='body1'>{t(language.text)}</Typography>
                {language.id === state.lang ? <CheckOutlined sx={{ml: 1}} fontSize='small'/>: null}
              </MenuItem>
            ))}
          </Popover>
        </Box>
        < Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Grid
            container
            sx={{ 
              flex: 1, 
              px: 2,
              justifyContent: "center",
              alignItems: "center" 
            }}
          >
            <Grid>
              <AuthCard>{children}</AuthCard>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
}

AuthWrapper.propTypes = { children: PropTypes.node };
