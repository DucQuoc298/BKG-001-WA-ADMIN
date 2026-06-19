import { Grid, SxProps } from '@mui/material';
import { DataGridPro, DataGridProProps, useGridApiRef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid-pro';
import { useMemo, useState } from 'react';
import useStyles from '../styles';
import { Pagination } from '../components';
import { DataTableProps } from '..';
import { DataTableMode, ROW_HEIGHT, getGridColumns } from 'types';
import { useTranslation } from 'react-i18next';
import Icons from 'assets/Icon';
import { useDataTable, useWindowSize } from 'hooks';

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
  store,
  ...props
}: DataTableProps) => {
  const defaultApiRef = useGridApiRef();
  const apiRef = props.apiRef ?? defaultApiRef;
  const { t } = useTranslation();
  const { height: windowHeight } = useWindowSize();
  const tableHeight = height ?? (windowHeight - 280);

  // 1. Integrate useDataTable hook
  const {
    rows: storeRows,
    rowCount: storeRowCount,
    loading: storeLoading,
    paginationModel: storePaginationModel,
    handlePaginationModelChange,
    rowSelectionModel: storeRowSelectionModel,
    setRowSelectionModel: setStoreRowSelectionModel,
  } = useDataTable({
    cacheKey: store?.cacheKey ?? '',
    mode: store?.mode ?? DataTableMode.LOCAL,
    data: store?.data,
    params: store?.params,
    fnGetData: store?.fnGetData,
    initialPageSize: defaultPagination?.pageSize ?? initialState?.pagination?.paginationModel?.pageSize ?? 14,
    initialPage: defaultPagination?.page ?? initialState?.pagination?.paginationModel?.page ?? 0,
  });

  //pagination
  const [paginationModel, setPaginationModel] = useState(
    defaultPagination ?? {
      pageSize: initialState?.pagination?.paginationModel?.pageSize ?? 14,
      page: initialState?.pagination?.paginationModel?.page ?? 0,
    }
  );

  const hasStore = !!store;
  const activeRows = hasStore ? storeRows : rows;
  const activeRowCount = hasStore ? storeRowCount : rowCount;
  const activePaginationModel = hasStore ? storePaginationModel : paginationModel;
  const activeLoading = hasStore ? storeLoading : props.loading;

  //styles
  const styles = useStyles();
  const dataGridStyles = useMemo(() => ({
    ...styles.dataTable,

    ...(activeRows.length === 0 ? {
      "& .MuiDataGrid-virtualScroller": {
        overflowY: "hidden !important",
      },
    } : {})
  }), [activeRows, styles.dataTable]) as SxProps;

  //select rows
  const [localRowSelectionModel, setLocalRowSelectionModel] = useState<any>(props.rowSelectionModel ?? { type: 'include', ids: new Set() });
  const activeRowSelectionModel = props.rowSelectionModel !== undefined
    ? props.rowSelectionModel
    : (hasStore && storeRowSelectionModel ? storeRowSelectionModel : localRowSelectionModel);

  // props
  const gridProps: Partial<DataGridProProps> = {
    localeText: {
      noRowsLabel: t("grid.no_row_label"),
    },
    disableColumnMenu: true,
    headerFilters: false,
    isCellEditable: () => false,
    hideFooterSelectedRowCount: true,
    keepNonExistentRowsSelected: true,
    ...props,
  };

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
        totalRowCount={activeRowCount}
        paginationModel={activePaginationModel}
        handleChangePage={(page) => {
          if (page < 0 || page * activePaginationModel.pageSize > (activeRowCount ?? 0))
            return;
          if (hasStore) {
            handlePaginationModelChange({ ...activePaginationModel, page });
          } else {
            setPaginationModel((prev) => {
              const newModel = { ...prev, page };
              handlePagination?.(newModel);
              return newModel;
            });
          }
        }}
        handleChangePageSize={(pageSize) => {
          if (hasStore) {
            handlePaginationModelChange({ page: 0, pageSize });
          } else {
            setPaginationModel((prev) => {
              const newModel = { ...prev, page: 0, pageSize };
              handlePagination?.(newModel);
              return newModel;
            });
          }
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
        height: tableHeight,
      }}
    >
      <Grid size={12}>
        <DataGridPro
          apiRef={apiRef}
          sx={{
            height: tableHeight,
            ...dataGridStyles
          }}
          columns={gridColumns as any}
          rows={activeRows}
          initialState={initialState}
          rowHeight={ROW_HEIGHT}
          {...gridProps}
          pinnedColumns={gridPinnedColumns}
          pagination
          loading={activeLoading}
          rowCount={activeRowCount}
          paginationModel={activePaginationModel}
          paginationMode={hasStore ? (store?.mode === 'remote' ? 'server' : 'client') : (props.paginationMode ?? (handlePagination ? 'server' : 'client'))}
          onPaginationModelChange={(model, details) => {
            if (hasStore) {
              handlePaginationModelChange(model);
            } else {
              props.onPaginationModelChange?.(model, details);
            }
          }}
          getRowHeight={() => (autoRowHeight ? "auto" : ROW_HEIGHT)}
          slots={{
            pagination: CustomPagination
          }}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick={disableRowSelectionOnClick}
          rowSelectionModel={activeRowSelectionModel as any}
          onRowSelectionModelChange={(params, details) => {
            handleRowSelectionModelChange?.(params, details);
            props.onRowSelectionModelChange?.(params, details);
            if (props.rowSelectionModel === undefined) {
              let newModel: any;
              if (Array.isArray(params)) {
                newModel = { type: 'include', ids: new Set(params) };
              } else {
                newModel = { type: params?.type || 'include', ids: new Set(params?.ids || []) };
              }
              if (hasStore) {
                setStoreRowSelectionModel?.(newModel);
              } else {
                setLocalRowSelectionModel(newModel);
              }
            }
          }}
        />
      </Grid>
    </Grid>
  )
}

export default DataTableView;