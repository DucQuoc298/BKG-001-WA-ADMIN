// ==============================|| UTILS - STYLES ||============================== //
export default {
  containers: {
    px: { xs: 0, sm: 3 },
    position: 'relative',
    width: '100%',
    maxWidth: '1600px !important',
    my: '24px',
  },


  gridContainer: {
    rowSpacing: 3,
    columnSpacing: 3,
    width: '100%',
    // maxWidth: 'lg',

  },
  gridItemFullWidth: {
    size: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 12,
    }
  },

  gridItem3Cols: {
    size: {
      xs: 12,
      sm: 12,
      md: 3,
      lg: 3,
      xl: 3,
    }
  },
  gridItem4Cols: {
    size: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 4,
      xl: 4,
    }
  },
  gridItem5Cols: {
    size: {
      xs: 12,
      sm: 12,
      md: 5,
      lg: 5,
      xl: 5,
    }
  },
  gridItem6Cols: {
    size: {
      xs: 12,
      sm: 12,
      md: 6,
      xl: 6,
      lg: 6,
    }
  },
  gridItem7Cols: {
    size: {
      xs: 12,
      sm: 12,
      md: 7,
      lg: 7,
      xl: 7,
    }
  },
  gridItem8Cols: {
    size: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 8,
      xl: 8,
    }
  },
  gridItem9Cols: {
    size: {
      xs: 12,
      sm: 12,
      md: 9,
      lg: 9,
      xl: 9,
    }
  },
  mainCard: {
    title: {
      fontWeight: 700,
      fontSize: "1.2rem",
      color: 'text.primary',
    }
  },
  //
  itemResponsive: {
    size: {
      xs: 12,
      sm: 12,
      md: 6,
      lg: 4,
      xl: 4,
    },
  },
  containerResponsive: {
    columnSpacing: "35px",
    rowSpacing: "16px",
  },
  itemResponsiveFull: {
    size: {
      xs: 12
    }
  },

  itemResponsive2Cols: {
    size: {
      xs: 12,
      sm: 12,
      md: 6,
      xl: 6,
      lg: 6,
    }
  },
  itemResponsive3Cols: {
    size: {
      xs: 12,
      sm: 12,
      md: 4,
      lg: 4,
      xl: 4,
    }
  },
  itemResponsive23Cols: {
    size: {
      xs: 12,
      sm: 12,
      md: 8,
    }
  },
  itemResponsive6Cols: {
    size: {
      xs: 12,
      sm: 6,
      md: 4,
      lg: 2,
      xl: 2,
    }
  },
  itemResponsive5Cols: {
    size: {
      xs: 12,
      sm: 5,
      md: 5,
      lg: 5,
      xl: 5,
    }
  },
  itemResponsive7Cols: {
    size: {
      xs: 12,
      sm: 7,
      md: 7,
      lg: 7,
      xl: 7,
    }
  },
  itemResponsive9Cols: {
    size: {
      xs: 12,
      sm: 9,
      md: 9,
      lg: 9,
      xl: 9,
    },
  },
  itemResponsive4Cols: {
    size: {
      xs: 12,
      sm: 12,
      md: 4,
      lg: 3,
      xl: 3,
    }
  },
  itemResponsive12Cols: {
    size: {
      xs: 12,
      sm: 1,
      md: 1,
      lg: 1,
      xl: 1,
    }
  },
  dialog: {
    content: {
      p: "20px 16px"
    }
  },
  dialogPaper: {
    m: "0px",
    overflowX: "hidden",
  },
  dialogTitleLabel: {},
  dialogTitleButton: {
    color: "text.primary",
    fontSize: "20px",
    m: "auto 20px auto auto",
    cursor: "pointer",
  },
  boxStyle1: {
    width: "100%",
    backgroundColor: "#F2F2F2",
    px: "16px",
    pt: "12px",
    borderRadius: "8px",
    mt: 2,
  },
  tabs: {
    // height: "38px",
    minHeight: "44px",
    "& button:first-of-type": {
      // pl: "27px",
      alignItems: "flex-start !important",
      minWidth: "fit-content",
    },
  },
  tab: {
    // minWidth: "124px",
    textTransform: "none",
    fontWeight: 500,
    minHeight: "44px",
    maxHeight: "44px",
    py: "0px",
    color: 'text.primary',
  },
  tabLabel: {
    textTransform: "none",
    fontWeight: 700,
    fontSize: "14px",
    display: 'flex',
  },
  tabLabelCount: {
    fontSize: "14px",
    fontWeight: 500,
    // color: 'text.primary',
    bgcolor: 'grey.200',
    borderRadius: '20px',
    padding: '0 6px',
    ml: 0.5,
  },
  rgb_standard: {
    backgroundColor: "grey.100",
    borderRadius: "8px",
  },
  container: {
    width: "100%",
    py: "16px",
    overflowY: "auto",
    height: "calc(100vh - 87px)",
    px: "0px !important",
  },
  advancedSearch: {
    container: {
      // width: "730px",style
      maxWidth: "730px",
      // height: "640px",
    },
    content: {
      p: '20px 16px'
    },
    card: {
      backgroundColor: 'grey.100',
      width: '100%'
    },
    label: {
      fontWeight: "600", lineHeight: "16px", mb: "8px"
    },
    button: {
      ml: "18px",
      mt: "auto",
    },
    action: {
      height: "68.5px",
      justifyContent: "center",
      MainCardShadow: "0 -1px 4px rgba(0, 0, 0, 0.3)",
    }
  },
  textField: {
    mutipleLine: {
      '& .MuiInputBase-input': {
        height: '50px !important',
        overflowY: 'auto !important',
      }

    }
  },
  totalInfo: {
    rowLabel: {
      size: { xs: 6, sm: 7, md: 8, lg: 9, xl: 9 }
    },
    rowValue: {
      size: { xs: 6, sm: 5, md: 4, lg: 3, xl: 3 }
    },
    label: {
      textAlign: "right",
      minWidth: "200px",
      color: "text.primary",
    },
    total: {
      textAlign: "right",
      minWidth: "200px",
      color: "text.primary",
      fontWeight: 700,
    },
    value: {
      textAlign: "right",
      // mr: '32px'
    },
    totalValue: {
      textAlign: "right",
      fontSize: "16px",
      fontWeight: 700,
      // mr: '32px'
    },
    totalAmtValue: {
      textAlign: "right",
      fontWeight: 700,
      fontSize: '18px'
    },
    stack: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
    },
    payment: {
      box: {
        cursor: 'pointer',
        '&:hover': { backgroundColor: 'grey.100' }
      },
      date: {
        color: "text.secondary",
        fontStyle: "italic",
      },
      value: {
        mr: 0, color: 'primary.main', fontWeight: 500
      },
      label: {
        minWidth: "200px",
        maxWidth: "200px"
      }
    }
  },
  groupCard: {
    container: {
      backgroundColor: "grey.100",
    }
  }
};