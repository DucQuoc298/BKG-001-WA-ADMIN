import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/Card/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import avatar1 from 'assets/images/users/avatar-1.png';
import { Divider, Grid, ListItem, Menu, MenuItem } from '@mui/material';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import styles from './styles';
import { ArrowForwardIosOutlined, CameraAltOutlined, CheckOutlined, DarkModeOutlined, LightModeOutlined, TranslateOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ILanguage, IThemeMode } from 'types';
import { useMain, useAuth, useBroadcastChannel } from 'hooks';
import { FLAG_ICONS } from 'assets/images/icons/flags';
import { languages } from 'utils';
import { redirectToLogin } from 'services/utils/navigation';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { BroadcastEventTypes } from 'services';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function Profile() {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [anchorRef, setAnchorRef] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { state: mainState, setField } = useMain();
  const { resetState: resetAuthState } = useAuth();
  const { postMessage } = useBroadcastChannel();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const [uiState, setUIState] = useState<{
    expandLang: HTMLElement | null;
    expandTheme: HTMLElement | null;
    expandChangeCompany: HTMLElement | null;
  }>({
    expandLang: null,
    expandTheme: null,
    expandChangeCompany: null,
  });
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  const handleClose = (event) => {
    if (anchorRef && anchorRef.contains(event.target)) {
      return;
    }
    setOpen(false);
  };


  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    const objectUrl = URL.createObjectURL(file);
    setAvatarUrl(objectUrl);

    // Đọc base64
    const reader = new FileReader();
    // reader.onload = () => {
    //   const base64 = reader.result
    //   // const result = data[0];
    // };
    reader.readAsDataURL(file);

    event.target.value = '';
  };
  const handleChangeLanguage = (lang: ILanguage) => {
    setUIState({ ...uiState, expandLang: null });
    i18n.changeLanguage(lang === ILanguage.VN ? 'vi' : 'en');
    setField('lang', lang === ILanguage.VN ? 'vi' : 'en');
  }
  const handleChangeTheme = (theme: IThemeMode) => {
    setUIState({ ...uiState, expandTheme: null });
    setField('themeMode', theme);
  }
  const handleLanguageClose = () => {
    setUIState({ ...uiState, expandLang: null });
  }
  const handleThemeClose = () => {
    setUIState({ ...uiState, expandTheme: null });
  }
  const handleLogout = () => {
    resetAuthState();
    postMessage(BroadcastEventTypes.AUTH_LOGOUT);
    redirectToLogin();
  }
  return (
    <Box sx={{ flexShrink: 0 }}>
      <Tooltip title="Profile" disableInteractive>
        <ButtonBase
          sx={(theme) => ({
            p: 0.25,
            borderRadius: 1,
            '&:focus-visible': { outline: `2px solid ${theme.palette.secondary.dark}`, outlineOffset: 2 }
          })}
          aria-label="open profile"
          ref={setAnchorRef}
          aria-controls={open ? 'profile-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <Avatar alt="profile user" type="circular" src={avatar1} size="sm" sx={{ '&:hover': { outline: '1px solid', outlineColor: 'primary.main' } }} >
            JD
          </Avatar>
        </ButtonBase>
      </Tooltip>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions ref={undefined} type="grow" position="top-right" in={open} {...TransitionProps}>
            <Paper sx={(theme) => ({ borderRadius: theme.shape.borderRadius, width: 290, minWidth: 240, maxWidth: { xs: 250, md: 290 } })}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false} sx={{ p: 0 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <Grid>
                        <Stack direction="row" sx={{ gap: 1.25, alignItems: 'center' }}>
                          <Box sx={{ position: 'relative', display: 'inline-flex' }}
                            onClick={() => fileInputRef.current?.click()}>
                            <Avatar
                              size="lg"
                              sx={{ '&:hover': { outline: '1px solid', outlineColor: 'primary.main' } }}
                              type="circular"
                              src={avatarUrl}
                            >
                              Q
                            </Avatar>
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                border: '1.5px solid',
                                borderColor: 'background.paper',
                                '&:hover': { bgcolor: 'primary.dark' },
                              }}
                            >
                              <CameraAltOutlined sx={{ fontSize: 11 }} />
                            </Box>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={handleAvatarFileChange}
                            />
                          </Box>
                          <Stack>
                            <Typography variant="h6">Trương Đức Quốc</Typography>
                            <Typography variant="body2" color="text.secondary">
                              truongducquoc298@gmail.com
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                    </Grid>
                    <Grid>
                      <Divider sx={{ my: 1.5 }} />
                    </Grid>
                    <List disablePadding>
                      <ListItem disablePadding>
                        <ListItemButton
                          aria-describedby={'language-popover'}
                          onClick={(event: React.MouseEvent<HTMLElement>) => {
                            setUIState({ ...uiState, expandLang: event.currentTarget });
                          }}
                        >
                          <TranslateOutlined style={styles.icon} />
                          <Typography variant="body1" sx={styles.label}>
                            {t('text.language')}
                          </Typography>
                          <ArrowForwardIosOutlined sx={{ fontSize: '14px', ml: 'auto' }} />
                        </ListItemButton>
                        <Menu
                          id={'language-popover'}
                          open={Boolean(uiState.expandLang)}
                          anchorEl={uiState.expandLang}
                          onClose={handleLanguageClose}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                        >
                          {languages.map((language) => (
                            <MenuItem
                              onClick={() => {
                                handleChangeLanguage(language.id as ILanguage)
                              }}
                              key={language.id}
                              sx={{ display: 'flex', alignItems: 'center', p: 1, cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                              <img src={FLAG_ICONS[language.id === ILanguage.VN ? 'vn' : 'us']} alt={language.id} width={20} style={{ marginRight: 8 }} />
                              <Typography variant='body1'>{t(language.text)}</Typography>
                              {mainState?.lang === (language.id === ILanguage.VN ? 'vi' : 'en') ? <CheckOutlined sx={{ ml: 1 }} fontSize='small' /> : null}
                            </MenuItem>
                          ))}
                        </Menu>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          aria-describedby={'theme-popover'}
                          onClick={(event: React.MouseEvent<HTMLElement>) => {
                            setUIState({ ...uiState, expandTheme: event.currentTarget });
                          }}
                        >
                          {mainState?.theme_mode === 'dark' ?
                            <DarkModeOutlined sx={{ ...styles.icon }} /> :
                            <LightModeOutlined sx={{ ...styles.icon }} />
                          }
                          <Typography variant="body1" sx={styles.label}>
                            {t('text.theme_mode')}
                          </Typography>
                          <ArrowForwardIosOutlined sx={{ fontSize: '14px', ml: 'auto' }} />
                        </ListItemButton>
                        <Menu
                          id={'theme-popover'}
                          open={Boolean(uiState.expandTheme)}
                          anchorEl={uiState.expandTheme}
                          onClose={handleThemeClose}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              handleChangeTheme(IThemeMode.LIGHT)
                            }}
                            sx={styles.menu_item}>
                            <LightModeOutlined sx={{ ...styles.icon, mr: 1 }} />
                            <Typography variant='body1'>{t("theme_mode.light")}</Typography>
                            {mainState?.themeMode === IThemeMode.LIGHT ? <CheckOutlined sx={{ ml: 1 }} fontSize='small' /> : null}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleChangeTheme(IThemeMode.DARK)
                            }}
                            sx={styles.menu_item}>
                            <DarkModeOutlined sx={{ ...styles.icon, mr: 1 }} />
                            <Typography variant='body1'>{t("theme_mode.dark")}</Typography>
                            {mainState?.themeMode === IThemeMode.DARK ? <CheckOutlined sx={{ ml: 1 }} fontSize='small' /> : null}
                          </MenuItem>
                        </Menu>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                        // onClick={() =>{console.log('help');
                        // }}
                        >
                          <QuestionCircleOutlined style={styles.icon} />
                          <Typography variant="body1" sx={styles.label}>
                            {t('text.help')}
                          </Typography>
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout}>
                          <LogoutOutlined style={{ ...styles.icon, color: theme.palette.error.main }} />
                          <Typography variant="body1" sx={{ ...styles.label, color: theme.palette.error.main }}>
                            {t('text.logout')}
                          </Typography>
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </CardContent>

                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}

TabPanel.propTypes = { children: PropTypes.node, value: PropTypes.number, index: PropTypes.number, other: PropTypes.any };
