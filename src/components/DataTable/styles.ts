export default () => {
  // const { palette } = useTheme();

  return {
    dataTable: {

      "& .MuiDataGrid-cell": {
        fontSize: "12px",
        // paddingY: "10px",
        // overflowWrap: "break-word",
        // alignSelf: "center",
        // color: "text.primary",
      },
    },
    dataTableView: {
      "& .MuiDataGrid-iconButtonContainer": {
        backgroundColor: "transparent",
      },


      "& .MuiDataGrid-row": {
        backgroundColor: "background.paper",
      },
      "& .MuiDataGrid-virtualScrollerRenderZone ": {
        transform: "translate3d(0px, 40px, 0px) !important",
      },
      "& .MuiDataGrid-iconButtonContainer .MuiIconButton-root": {
        backgroundColor: "transparent",
        color: "text.secondary",
        borderRadius: "16px",
      },
    },
    dataTableForm: {
      "& .MuiDataGrid-row--dynamicHeight": {
        "& .MuiDataGrid-cell": {
          display: "flex",
          alignItems: "center",
          minHeight: '40px',
          "&.MuiDataGrid-cell--editing": {
            padding: "0px !important",
            alignItems: "stretch !important",
          }
        }
      },
      "& .MuiDataGrid-cell--editing": {
        padding: "0px !important",
      }
    },
    baseInputEdit: {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "stretch",
      "& .MuiInputBase-root": {
        fontSize: "14px",
        padding: "0px !important",
        height: "100% !important",
        alignItems: "center",
      },
      "& .MuiInputBase-root input": {
        padding: "10px !important",
        height: "100%",
        boxSizing: "border-box",
      },
      "& .MuiInputBase-root textarea": {
        padding: "10px !important",
        height: "100%",
        boxSizing: "border-box",
      },
      "& fieldset": { border: "none" },
    },
  }
}
