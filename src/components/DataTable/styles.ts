// import { useTheme } from "@mui/material";

const GRID_HEADER_HEIGHT_PX = '40px';

export default () => {
  // const { palette } = useTheme();

  return {
    dataTableView: {
      border: "none",
      "& .MuiDataGrid-columnHeaders": {
        backgroundColor: "grey.200",
        height: `${GRID_HEADER_HEIGHT_PX} !important`,
        minHeight: `${GRID_HEADER_HEIGHT_PX} !important`,
        lineHeight: `${GRID_HEADER_HEIGHT_PX} !important`,
        borderRadius: '8px',
        padding: '0 15px'
      },
      "& .MuiDataGrid-columnHeader": {
        height: `${GRID_HEADER_HEIGHT_PX} !important`,
      },
      "& .MuiDataGrid-columnHeadersInner": {
        minHeight: "48px",
        maxHeight: "48px",
      },
      "& .MuiDataGrid-columnHeader, & .MuiDataGrid-filler, & .MuiDataGrid-scrollbarFiller": {
        backgroundColor: "grey.200",
      },
      "& .MuiDataGrid-filler--horizontal": {
        display: "none",
      },
      "& .MuiDataGrid-scrollbarFiller": {
        display: "none",
      },
      "& .MuiDataGrid-iconButtonContainer": {
        backgroundColor: "transparent",
      },
      "& .MuiDataGrid-columnHeaderTitle": {
        fontSize: "14px",
        color: "text.primary",
      },
      "& .MuiDataGrid-cellContent": {
        fontSize: "14px",
        paddingY: "10px",
        overflowWrap: "break-word",
        alignSelf: "center",
        color: "text.primary",
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
