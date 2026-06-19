// ==============================|| THEME CONSTANT ||============================== //

import { IThemeMode } from "types";

export const APP_DEFAULT_PATH = '/home';
export const DRAWER_WIDTH = 260;
export const MINI_DRAWER_WIDTH = 60;
export const HEADER_HEIGHT = 40;
export const TOOLBAR_HEIGHT = 50;


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
      rowSpacing: 3,
      columnSpacing: 2.75
    },
    gridItem1Columns: {
      size: {
        xs: 3,
        sm: 2,
        md: 1,
        lg: 1
      }
    },
    gridItem2Columns: {
      size: {
        xs: 4,
        sm: 4,
        md: 2,
        lg: 2
      }
    },
    gridItem3Columns: {
      size: {
        xs: 12,
        sm: 6,
        md: 3,
        lg: 3
      }
    },
    gridItem4Columns: {
      size: {
        xs: 12,
        sm: 6,
        md: 4,
        lg: 4
      }
    },
    gridItem5Columns: {
      size: {
        xs: 12,
        sm: 6,
        md: 5,
        lg: 5
      }
    },
    gridItem6Columns: {
      size: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 6
      }
    },
    gridItem7Columns: {
      size: {
        xs: 12,
        sm: 6,
        md: 7,
        lg: 7
      }
    },
    gridItem8Columns: {
      size: {
        xs: 12,
        sm: 6,
        md: 8,
        lg: 8
      }
    },
    gridItem9Columns: {
      size: {
        xs: 12,
        sm: 6,
        md: 9,
        lg: 9
      }
    },
    gridItem10Columns: {
      size: {
        xs: 8,
        sm: 8,
        md: 10,
        lg: 10
      }
    },
    gridItem11Columns: {
      size: {
        xs: 9,
        sm: 10,
        md: 11,
        lg: 11
      }
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