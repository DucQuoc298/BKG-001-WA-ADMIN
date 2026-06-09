import { Grid, SxProps } from '@mui/material';
import { DataGridPro, DataGridProProps, useGridApiRef, GridRowSelectionModel, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid-pro';
import { useMemo, useState } from 'react';
import useStyles from '../styles';
import { Pagination } from '../components';
import { getDefaultGridHeight } from 'utils'
import { DataTableProps } from '..';
import { ROW_HEIGHT, getGridColumns } from 'types';
import { useTranslation } from 'react-i18next';
import Icons from 'assets/Icon';

const DataTableView = ({
  height,
  columns = [],
  rows = [],
  rowCount,
  initialState,
  paginationModel: defaultPagination,
  autoRowHeight,
  checkboxSelection,
  handleRowSelectionModelChange,
  handlePagination,
  disableRowSelectionOnClick = false,
  actionBars,
  handleActionClick,
  ...props
}: DataTableProps) => {
  const defaultApiRef = useGridApiRef();
  const apiRef = props.apiRef ?? defaultApiRef;
  const { t } = useTranslation();
  //styles
  const styles = useStyles();
  const dataGridStyles = useMemo(() => ({
    ...styles.dataTable,

    ...(rows.length === 0 ? {
      "& .MuiDataGrid-virtualScroller": {
        overflowY: "hidden !important",
      },
    } : {})
  }), [rows, styles.dataTable]) as SxProps;

  //select rows
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>();

  // props
  const gridProps: Partial<DataGridProProps> = {
    localeText: {
      noRowsLabel: t("grid.no_row_label"),
    },
    disableColumnMenu: true,
    headerFilters: false,
    isCellEditable: () => false,
    hideFooterSelectedRowCount: true,
    ...props,
  };

  //pagination
  const [paginationModel, setPaginationModel] = useState(
    defaultPagination ?? {
      pageSize: initialState?.pagination?.paginationModel?.pageSize ?? 14,
      page: initialState?.pagination?.paginationModel?.page ?? 0,
    }
  );
  const [prevDefaultPagination, setPrevDefaultPagination] = useState(defaultPagination);

  if (JSON.stringify(defaultPagination) !== JSON.stringify(prevDefaultPagination)) {
    setPrevDefaultPagination(defaultPagination);
    if (defaultPagination) {
      setPaginationModel(defaultPagination);
    }
  }

  //customization
  const CustomPagination = () => {
    return (
      <Pagination
        totalRowCount={rowCount}
        paginationModel={paginationModel}
        handleChangePage={(page) => {
          if (page < 0 || page * paginationModel.pageSize > (rowCount ?? 0))
            return;
          setPaginationModel((prev) => {
            const newModel = { ...prev, page };
            handlePagination?.(newModel);
            return newModel;
          });
        }}
        handleChangePageSize={(pageSize) => {
          setPaginationModel((prev) => {
            const newModel = { ...prev, page: 0, pageSize };
            handlePagination?.(newModel);
            return newModel;
          });
        }}
      />
    )
  }
  //columns 
  const gridColumns = useMemo(() => {
    const baseCols = getGridColumns(columns, disableRowSelectionOnClick);
    if (actionBars && actionBars.length > 0) {
      baseCols.push({
        field: 'actions',
        type: 'actions',
        width: 50,
        resizable: false,
        getActions: (params: GridRowParams) => {
          return actionBars.map((act) => (
            <GridActionsCellItem
              key={act.key}
              icon={act.icon ? <Icons name={act.icon} size={16} /> : undefined}
              label={act.label}
              disabled={act.disabled}
              showInMenu
              onClick={() => handleActionClick?.(act.key, params.row)}
            />
          ));
        }
      });
    }
    return baseCols;
  }, [columns, disableRowSelectionOnClick, actionBars, handleActionClick, t]);

  const gridPinnedColumns = useMemo(() => {
    if (props.pinnedColumns) {
      return props.pinnedColumns;
    }
    const pinned: { left?: string[]; right?: string[] } = {};
    if (checkboxSelection) {
      pinned.left = ['__check__'];
    }
    if (actionBars && actionBars.length > 0) {
      pinned.right = ['actions'];
    }
    return pinned;
  }, [props.pinnedColumns, checkboxSelection, actionBars]);

  return (
    <Grid container size={12}
      sx={{
        height: height ?? getDefaultGridHeight(),
      }}
    >
      <Grid size={12}>
        <DataGridPro
          apiRef={apiRef}
          sx={{
            height: height ?? getDefaultGridHeight(),
            ...dataGridStyles
          }}
          columns={gridColumns as any}
          rows={rows}
          initialState={initialState}
          rowHeight={ROW_HEIGHT}
          {...gridProps}
          pinnedColumns={gridPinnedColumns}
          pagination
          paginationModel={paginationModel}
          getRowHeight={() => (autoRowHeight ? "auto" : ROW_HEIGHT)}
          slots={{
            pagination: CustomPagination
          }}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick={disableRowSelectionOnClick}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={(params, details) => {
            handleRowSelectionModelChange?.(params, details);
            setRowSelectionModel(params)
          }}
        />
      </Grid>
    </Grid>
  )
}

export default DataTableView;