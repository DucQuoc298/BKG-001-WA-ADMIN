export default function DataGridPro(theme) {
  const { palette, typography } = theme;

  return {
    MuiDataGrid: {
      defaultProps: {
        rowHeight: 40,
        columnHeaderHeight: 40,
      },
      styleOverrides: {
        root: {
          border: 'none',
          //varibles
          '&[class*="MuiDataGridVariables-"], &[class*="MuiDataGridVariables-"] ~ &': {
            '--DataGrid-t-color-background-base': '#transparent',
            '--DataGrid-t-header-background-base': palette.grey[200],
            '--DataGrid-t-cell-background-pinned': palette.background.paper,

          },
          fontSize: '0.875rem',
          fontFamily: typography.fontFamily,
          //header
          '& .MuiDataGrid-columnHeaders': {
            borderRadius: '8px',
            backgroundColor: palette.grey[200]
          },
          '& .MuiDataGrid-row--borderBottom .MuiDataGrid-columnHeader, & .MuiDataGrid-row--borderBottom .MuiDataGrid-filler, & .MuiDataGrid-row--borderBottom .MuiDataGrid-scrollbarFiller': {
            borderBottom: 'none !important',
          },
          //body
          "& .MuiDataGrid-cell": {
            fontSize: "12px",
          },
          //scrollbar
          "& .MuiDataGrid-scrollbar": {

          },
          "& .MuiDataGrid-scrollbarContent": {

          },
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },
          // Custom row hover & selected state background styling
          '& .MuiDataGrid-row:hover, & .MuiDataGrid-row.Mui-hovered': {
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.08) !important'
              : 'rgba(24, 144, 255, 0.06) !important',
            cursor: 'pointer',
          },
          // Custom row selected background styling
          '& .MuiDataGrid-row.Mui-selected': {
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(24, 144, 255, 0.16) !important'
              : 'rgba(24, 144, 255, 0.10) !important',
          },
          '& .MuiDataGrid-row.Mui-selected:hover, & .MuiDataGrid-row.Mui-selected.Mui-hovered': {
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(24, 144, 255, 0.24) !important'
              : 'rgba(24, 144, 255, 0.16) !important',
          },
          // Custom pinned columns selection & hover background styling
          '& .MuiDataGrid-row.Mui-selected .MuiDataGrid-cell--pinnedLeft, & .MuiDataGrid-row.Mui-selected .MuiDataGrid-cell--pinnedRight': {
            backgroundColor: 'inherit !important',
          },
          '& .MuiDataGrid-row:hover .MuiDataGrid-cell--pinnedLeft, & .MuiDataGrid-row:hover .MuiDataGrid-cell--pinnedRight, & .MuiDataGrid-row.Mui-hovered .MuiDataGrid-cell--pinnedLeft, & .MuiDataGrid-row.Mui-hovered .MuiDataGrid-cell--pinnedRight': {
            backgroundColor: 'inherit !important',
          },
          // Custom pinned columns fading borders (box-shadow instead of solid lines)
          '& .MuiDataGrid-cell--lastVisiblePinnedLeft, & .MuiDataGrid-columnHeader--lastVisiblePinnedLeft': {
            borderRight: 'none !important',
            boxShadow: theme.palette.mode === 'dark'
              ? '5px 0 8px -5px rgba(0, 0, 0, 0.6) !important'
              : '5px 0 8px -5px rgba(0, 0, 0, 0.16) !important',
          },
          '& .MuiDataGrid-cell--firstVisiblePinnedRight, & .MuiDataGrid-columnHeader--firstVisiblePinnedRight': {
            borderLeft: 'none !important',
            boxShadow: theme.palette.mode === 'dark'
              ? '-5px 0 8px -5px rgba(0, 0, 0, 0.6) !important'
              : '-5px 0 8px -5px rgba(0, 0, 0, 0.16) !important',
          },
        },
      }
    }
  };
}
