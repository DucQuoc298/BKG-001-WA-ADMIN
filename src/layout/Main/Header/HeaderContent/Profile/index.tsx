import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
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
import { Button, Divider, Grid, IconButton, InputAdornment, ListItem, Menu, MenuItem, Popover } from '@mui/material';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import styles from './styles';
import { ArrowForwardIosOutlined, CameraAltOutlined, CheckOutlined, LogoutOutlined, ChangeCircleOutlined, DarkModeOutlined, LightModeOutlined, TranslateOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ILanguage, IThemeMode } from 'types';
import { useMain, useAuth, useBroadcastChannel, useLocalStorage, useDocument, useUser, useSnackbar } from 'hooks';
import { FLAG_ICONS } from 'assets/images/icons/flags';
import { languages, setAuthToken } from 'utils';
import { redirectToLogin } from 'services/utils/navigation';
import { refreshToken } from 'services/api/authorization';
import { EyeInvisibleOutlined, EyeOutlined, KeyOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { BroadcastEventTypes } from 'services';
import { useDispatch } from 'react-redux';
import { RESET_APP } from 'store';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dialog, TextField } from 'components';
// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}
interface IChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function Profile() {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [anchorRef, setAnchorRef] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { state: mainState, setField } = useMain();
  const { resetState: resetAuthState, state, setState } = useAuth();
  const { state: authToken } = useLocalStorage('authToken', state.token);
  const { postMessage } = useBroadcastChannel();
  const { attachFile, addLink } = useDocument();
  const { user, updatePassword, changeCompany, listCompany } = useUser();
  const { success } = useSnackbar();

  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

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

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required(t('errors.required', { 0: t('AUTH.current_password') }))
      .test('no-leading-trailing-whitespace', t('errors.no_leading_trailing_whitespace', { 0: t('AUTH.current_password') }), (value) => value === value?.trim())
      .max(20, t('errors.max_length', { 0: t('AUTH.current_password'), 1: 20 })),
    newPassword: Yup.string().required(t('errors.required', { 0: t('AUTH.new_password') }))
      .test('no-leading-trailing-whitespace', t('errors.no_leading_trailing_whitespace', { 0: t('AUTH.new_password') }), (value) => value === value?.trim())
      .max(20, t('errors.max_length', { 0: t('AUTH.new_password'), 1: 20 })),
    confirmNewPassword: Yup.string().required(t('errors.required', { 0: t('AUTH.confirm_password') }))
      .oneOf([Yup.ref('newPassword')], t('errors.confirm_password_must_match_new_password'))
      .test('no-leading-trailing-whitespace', t('errors.no_leading_trailing_whitespace', { 0: t('AUTH.confirm_password') }), (value) => value === value?.trim())
      .max(20, t('errors.max_length', { 0: t('AUTH.confirm_password'), 1: 20 })),
  });

  useEffect(() => {
    if (!state?.token) return;
    let objectUrl: string;

    const fetchAvatar = (token: string) => {
      fetch(`${import.meta.env.VITE_BASE_URI || ''}/frmcsoperator/getavatar?access_token=${token}`)
        .then((res) => {
          if (res.status === 401) {
            throw new Error('401');
          }
          if (!res.ok) {
            throw new Error('FAILED');
          }
          return res.blob();
        })
        .then((blob) => {
          const imageBlob = new Blob([blob], { type: 'image/jpeg' });
          objectUrl = URL.createObjectURL(imageBlob);
          setAvatarUrl(objectUrl);
        })
        .catch((err) => {
          if (err.message === '401' && state.refreshToken) {
            refreshToken(state.refreshToken)
              .then((res: any) => {
                const result = res.data?.result?.data ?? res.data?.data ?? res.data;
                const newToken = result?.token ?? result?.accessToken ?? result;
                const newRefreshToken = result?.refreshToken;

                if (newToken) {
                  setState((prevState) => ({
                    ...prevState,
                    token: newToken,
                    ...(newRefreshToken ? { refreshToken: newRefreshToken } : {}),
                  }));
                  setAuthToken(newToken, newRefreshToken);
                  fetchAvatar(newToken);
                } else {
                  setAvatarUrl(undefined);
                }
              })
              .catch(() => {
                setAvatarUrl(undefined);
              });
          } else {
            setAvatarUrl(undefined);
          }
        });
    };

    fetchAvatar(authToken);

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);
  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    const objectUrl = URL.createObjectURL(file);
    setAvatarUrl(objectUrl);

    // Đọc base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result
      attachFile({
        comments: 'AVATAR',
        linkto: 'OPD',
        referencekey1: user?.operatorid ?? '',
        file: {
          filename: file.name,
          filetype: file.name.split('.').pop() || '',
          data: `${base64}`,
        },
      }, (data) => {
        const result = data[0];
        addLink({
          autonum: result.autonum,
          category: result.category,
          comments: 'AVATAR',
          documentcode: result.documentcode,
          filename: result.filename,
          linkto: 'OPD',
          referencekey1: user?.operatorid ?? '',
          subject: result.filename,
        })
        success(t('alert.update_avatar_successfully'))
      });
    };
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
    redirectToLogin(false);
  }
  const handleChangeCompanyOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUIState({ ...uiState, expandChangeCompany: event.currentTarget });
  }
  const handleChangeCompanyClose = () => {
    setUIState({ ...uiState, expandChangeCompany: null });
  }

  const { handleSubmit, reset, formState: { errors }, register } = useForm<IChangePasswordForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });
  const handleChangePasswordOpen = () => {
    reset();
    setOpenChangePassword(true);
  };
  const handleChangePasswordClose = () => {
    reset();
    setOpenChangePassword(false);
  };
  const onSubmitChangePassword = (data: IChangePasswordForm) => {
    updatePassword({ oldPassword: data.currentPassword, newPassword: data.newPassword }, () => {
      handleChangePasswordClose();
      success(t('alert.update_password_successfully'));
    });
  };
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
          <Avatar
            src={avatarUrl}
            size="sm"
            sx={{ '&:hover': { outline: '1px solid', outlineColor: 'primary.main' } }}
            type="circular"
          >
            {!avatarUrl && (user?.operatorname?.charAt(0) ?? 'U')}
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
                              {!avatarUrl && (user?.operatorname?.charAt(0) ?? 'U')}
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
                            <Typography variant="h6">{user?.operatorname}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user?.operatorid}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                    </Grid>
                    <Grid>
                      <Divider sx={{ my: 1.5 }} />
                    </Grid>
                    <List disablePadding>
                      {listCompany !== undefined && listCompany.length > 1 && (
                        <ListItem disablePadding>
                          <ListItemButton
                            aria-describedby={'company-popover'}
                            onClick={handleChangeCompanyOpen}
                          >
                            <ChangeCircleOutlined sx={{ ...styles.icon }} />
                            <Typography variant="body1" sx={styles.label}>
                              {t('text.change_company')}
                            </Typography>
                            <ArrowForwardIosOutlined sx={{ fontSize: '14px', ml: 'auto' }} />
                          </ListItemButton>
                          <Popover
                            id={'company-popover'}
                            open={Boolean(uiState.expandChangeCompany)}
                            anchorEl={uiState.expandChangeCompany}
                            onClose={handleChangeCompanyClose}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'left',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                          >
                            {(listCompany || []).map((company, key) => (
                              <MenuItem
                                key={key}
                                onClick={() => {
                                  handleChangeCompanyClose();
                                  user?.company !== company.tvcdb && changeCompany({ cpnId: company.tvcdb }, (data) => {
                                    setState({ ...state, user: JSON.stringify(data), refreshToken: data.refreshToken, token: data.token });
                                    setAuthToken(data.token, data.refreshToken);
                                    handleChangeCompanyClose();
                                    dispatch({ type: RESET_APP });
                                  });
                                }}
                                sx={styles.menu_item}>
                                <Typography variant='body1'>{company.tvcdbname}</Typography>
                                {user?.company === company.tvcdb ? <CheckOutlined sx={{ ml: 1 }} fontSize='small' /> : null}
                              </MenuItem>
                            ))}
                          </Popover>
                        </ListItem>)}
                      <ListItem disablePadding>
                        <ListItemButton onClick={handleChangePasswordOpen}>
                          <KeyOutlined style={{ ...styles.icon }} />
                          <Typography variant="body1" sx={{ ...styles.label }}>
                            {t('text.change_password')}
                          </Typography>
                        </ListItemButton>
                        <Dialog
                          open={openChangePassword}
                          onClose={handleChangePasswordClose}
                          title={t('text.change_password')}
                          maxWidth={'xs'}
                          action={
                            <>
                              <Button
                                variant="text"
                                onClick={handleChangePasswordClose}>
                                {t('text.cancel')}
                              </Button>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit(onSubmitChangePassword)}>
                                {t('text.save')}
                              </Button>
                            </>
                          }
                        >
                          <form onSubmit={handleSubmit(onSubmitChangePassword)}>
                            <Grid container spacing={3}>
                              <Grid size={12}>
                                <TextField
                                  id="current-password"
                                  type={showPasswords.current ? 'text' : 'password'}
                                  required
                                  label={t("AUTH.current_password")}
                                  fullWidth
                                  error={Boolean(errors.currentPassword)}
                                  errors={errors.currentPassword?.message}
                                  {...register("currentPassword", { required: true })}
                                  slotProps={{
                                    input: {
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                            onMouseDown={(e) => e.preventDefault()}
                                            edge="end"
                                            color="secondary"
                                          >
                                            {showPasswords.current ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                          </IconButton>
                                        </InputAdornment>)
                                    }
                                  }}
                                />

                              </Grid>
                              <Grid size={12}>
                                <TextField
                                  id="new-password"
                                  type={showPasswords.new ? 'text' : 'password'}
                                  required
                                  label={t("AUTH.new_password")}
                                  fullWidth
                                  error={Boolean(errors.newPassword)}
                                  errors={errors.newPassword?.message}
                                  {...register("newPassword", { required: true })}
                                  slotProps={{
                                    input: {
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                            onMouseDown={(e) => e.preventDefault()}
                                            edge="end"
                                            color="secondary"
                                          >
                                            {showPasswords.new ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                          </IconButton>
                                        </InputAdornment>)
                                    }
                                  }}
                                />

                              </Grid>
                              <Grid size={12}>
                                <TextField
                                  id="confirm-password"
                                  type={showPasswords.confirm ? 'text' : 'password'}
                                  required
                                  label={t("AUTH.confirm_password")}
                                  fullWidth
                                  error={Boolean(errors.confirmNewPassword)}
                                  errors={errors.confirmNewPassword?.message}
                                  {...register("confirmNewPassword", { required: true })}
                                  slotProps={{
                                    input: {
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                            onMouseDown={(e) => e.preventDefault()}
                                            edge="end"
                                            color="secondary"
                                          >
                                            {showPasswords.confirm ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                          </IconButton>
                                        </InputAdornment>)
                                    }
                                  }}
                                />

                              </Grid>
                            </Grid>
                          </form>
                        </Dialog>
                      </ListItem>
                    </List>
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
