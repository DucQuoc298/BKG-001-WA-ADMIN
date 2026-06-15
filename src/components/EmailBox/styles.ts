export default (theme: any) => {
  return {
    container: {
      position: 'fixed',
      bottom: 0,
      right: 24,
      width: { xs: 'calc(100% - 96px)', sm: '720px' },
      zIndex: 1300,
      backgroundColor: theme.palette.background.paper,
      borderRadius: '12px 12px 0 0',
      border: '1px solid',
      borderColor: 'divider',
      boxShadow: theme.palette.mode === 'dark' ? '0px 8px 32px rgba(0, 0, 0, 0.5)' : '0px 8px 32px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'height 0.2s ease-in-out',
    },
    header: {
      container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: '10px 16px',
        backgroundColor: theme.palette.background.paper,
        cursor: 'pointer',
        userSelect: 'none',
        borderColor: 'divider',
      },
      title: {
        fontWeight: 600,
        color: theme.palette.text.primary
      },
      btn: {
        color: 'text.secondary',
        p: 0.5
      }
    },
    body: {
      container: {
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        maxHeight: '84vh',
        gap: 1
      },
      toRow: {
        container: (hasError: boolean) => ({
          display: 'flex',
          alignItems: 'center',
          py: 1,
          borderBottom: '1px solid',
          borderColor: hasError ? 'error.main' : 'divider',
          gap: 1.5,
        }),
        label: {
          color: 'text.secondary',
          width: '50px',
          fontWeight: 500
        },
        input: {
          fontSize: '14px',
          p: 0
        },
        toggles: {
          display: 'flex',
          gap: 1.5,
          pr: 1,
          userSelect: 'none'
        },
        toggleBtn: {
          color: 'text.secondary',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 500,
          '&:hover': { color: 'primary.main', textDecoration: 'underline' }
        }
      },
      ccRow: {
        container: (hasError: boolean) => ({
          display: 'flex',
          alignItems: 'center',
          py: 1,
          borderBottom: '1px solid',
          borderColor: hasError ? 'error.main' : 'divider',
          gap: 1.5,
        }),
        closeBtn: {
          p: 0.25,
          color: 'text.secondary'
        }
      },
      bccRow: {
        container: (hasError: boolean) => ({
          display: 'flex',
          alignItems: 'center',
          py: 1,
          borderBottom: '1px solid',
          borderColor: hasError ? 'error.main' : 'divider',
          gap: 1.5,
        }),
        closeBtn: {
          p: 0.25,
          color: 'text.secondary'
        }
      },
      subjectRow: {
        container: (hasError: boolean) => ({
          display: 'flex',
          alignItems: 'center',
          py: 1,
          borderBottom: '1px solid',
          borderColor: hasError ? 'error.main' : 'divider',
          gap: 1.5,
          mb: 2
        })
      },
      errorText: {
        mt: 0.5,
        mb: 1,
        display: 'block'
      },
      subjectErrorText: {
        mt: -1.5,
        mb: 1.5,
        display: 'block'
      },
      attachments: {
        titleContainer: {
          mt: 2
        },
        titleText: {
          mb: 1,
          fontWeight: 600,
          color: 'text.secondary',
          fontSize: '12px'
        },
        list: {
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75
        },
        item: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 0.75,
          px: 1.5,
          borderRadius: '6px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'action.hover',
        },
        itemContent: {
          display: 'flex',
          alignItems: 'center',
          gap: 1
        },
        icon: {
          fontSize: 14,
          color: 'text.secondary'
        },
        name: {
          fontWeight: 500,
          fontSize: '12px',
          wordBreak: 'break-all'
        },
        size: {
          fontSize: '10px',
          color: 'text.secondary'
        },
        closeBtn: {
          color: 'text.secondary',
          p: 0.25
        }
      }
    }
  }
}