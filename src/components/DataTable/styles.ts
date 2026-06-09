// import { useTheme } from "@mui/material";

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

    },
    baseInputEdit: {
      width: "100%",
      "& .MuiInputBase-root": { fontSize: "14px", padding: "0px !important" },
      "& .MuiInputBase-root input": {
        padding: "10px !important",
      },
      "& .MuiInputBase-root textarea": {
        padding: "10px !important",
      },
      "& fieldset": { border: "none" },
    },
  }
}
