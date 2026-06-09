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
            '--DataGrid-t-header-background-base': '#transparent',

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
        },
      }
    }
  };
}
