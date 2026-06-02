// ==============================|| THEME CONSTANT ||============================== //

import { IThemeMode } from "types";

export const APP_DEFAULT_PATH = '/dashboard/default';
export const DRAWER_WIDTH = 260;
export const MINI_DRAWER_WIDTH = 60;


export const mainConfig = {
  fontFamily: `Inter, sans-serif`,
  themeMode: IThemeMode.LIGHT,
  lang: "vi"
};
export const authConfig = {
  user: {},
  loginStatus: false,
  token: '',
  refreshToken: '',
  rememberMe: null
};

export const KEY_CONTEXT = {
  MAIN: 'erp-home',
  AUTH: 'erp-auth'
}

export const styles = {
  container: {
    px: { xs: 0, sm: 10, md: 10, lg: 28 },
    position: 'relative',
    width: '100%',
    height: '100%',
    maxWidth: '1600px !important',
    my: '24px',
  },
  grid: {
    container: {
      rowSpacing: 4.5,
      columnSpacing: 2.75
    },
    gridItem1Columns: {
      size: 1
    },
    gridItem2Columns: {
      size: 2
    },
    gridItem3Columns: {
      size: 3
    },
    gridItem4Columns: {
      size: 4
    },
    gridItem5Columns: {
      size: 5
    },
    gridItem6Columns: {
      size: 6
    },
    gridItem7Columns: {
      size: 7
    },
    gridItem8Columns: {
      size: 8
    },
    gridItem9Columns: {
      size: 9
    },
    gridItem10Columns: {
      size: 10
    },
    gridItem11Columns: {
      size: 11
    },
    gridItem12Columns: {
      size: 12
    }
  
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 400,
    bgcolor: 'background.paper',
    p: 2,
  }
}