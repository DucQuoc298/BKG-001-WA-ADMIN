import { Grid, SxProps } from '@mui/material';
import {
  DataGridPro,
  DataGridProProps,
  useGridApiRef,
  GridActionsCellItem,
  GridRowParams,
  GridCellModesModel,
  GridCellModes,
  GridCellParams,
  GridRowOrderChangeParams,
  GridCellEditStopParams,
} from '@mui/x-data-grid-pro';
import { useCallback, useMemo, useRef, useState } from 'react';

const isKeyboardEvent = (event: any): event is React.KeyboardEvent => {
  return !!event && 'key' in event;
};
import useStyles from '../styles';
import { getDefaultGridHeight } from 'utils'
import { DataTableProps } from '..';
import { DataTableMode, EGridColTypes, ROW_HEIGHT, getGridColumns } from 'types';
import { useTranslation } from 'react-i18next';
import Icons from 'assets/Icon';
import { useDataTable } from 'hooks';
import {
  CellEditNumber,
  CellEditText,
  CellEditAutocomplete
} from './components'

const DataTableForm = ({
  height,
  columns = [],
  rows = [],
  rowCount: _rowCount,
  initialState,
  autoRowHeight = true,
  rowReordering = true,
  disableRowSelectionOnClick = false,
  actionBars,
  handleActionClick,
  store,
  readOnlyCells = [],
  onGridEditing,
  onProcessRowUpdate,
  handleRowOrderChange,
  ...props
}: DataTableProps) => {
  const defaultApiRef = useGridApiRef();
  const apiRef = props.apiRef ?? defaultApiRef;
  const { t } = useTranslation();

  // 1. Integrate useDataTable hook
  const {
    rows: storeRows,
    loading: storeLoading,
    setRows,
  } = useDataTable({
    cacheKey: store?.cacheKey ?? '',
    mode: store?.mode ?? DataTableMode.LOCAL,
    data: store?.data,
    params: store?.params,
    fnGetData: store?.fnGetData,
    initialPageSize: initialState?.pagination?.paginationModel?.pageSize ?? 1000,
    initialPage: initialState?.pagination?.paginationModel?.page ?? 0,
  });

  const hasStore = !!store;
  const activeRows = hasStore ? storeRows : rows;
  const activeLoading = hasStore ? storeLoading : props.loading;

  //styles
  const styles = useStyles();
  const dataGridStyles = useMemo(() => ({
    ...styles.dataTable,
    ...styles.dataTableForm,

    ...(activeRows.length === 0 ? {
      "& .MuiDataGrid-virtualScroller": {
        overflowY: "hidden !important",
      },
    } : {})
  }), [activeRows, styles.dataTable]) as SxProps;

  // --- Row reorder handler ---
  const handleRowReorder = useCallback((params: GridRowOrderChangeParams) => {
    if (hasStore && setRows) {
      setRows((prevRows) => {
        const result = Array.from(prevRows);
        const [removed] = result.splice(params.oldIndex, 1);
        result.splice(params.targetIndex, 0, removed);
        return result;
      });
    }
    handleRowOrderChange?.({
      row: params.row,
      oldIndex: params.oldIndex,
      targetIndex: params.targetIndex,
    });
  }, [hasStore, setRows, handleRowOrderChange]);

  // --- Cell editing logic ---
  const refCellModesModel = useRef<GridCellModesModel>({});
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});

  const handleCellClick = useCallback((params: GridCellParams, event: React.MouseEvent) => {
    // Don't enter edit mode for non-editable cells
    if (params.isEditable === false) return;

    // Don't enter edit mode if clicking autocomplete options
    if ((event.target as HTMLElement).classList?.contains("MuiAutocomplete-option")) return;

    // Check readOnlyCells
    const isReadOnly = readOnlyCells.some(
      (rc) => rc.row === params.id && (!rc.field || rc.field === params.field)
    );
    if (isReadOnly) return;

    setCellModesModel((prevModel) => {
      const newModel: GridCellModesModel = {
        // Set all previously editing cells back to View mode
        ...Object.keys(prevModel).reduce(
          (acc, id) => ({
            ...acc,
            [id]: Object.keys(prevModel[id]).reduce(
              (acc2, field) => ({
                ...acc2,
                [field]: { mode: GridCellModes.View },
              }),
              {}
            ),
          }),
          {}
        ),
        // Set the clicked cell to Edit mode
        [params.id]: {
          ...Object.keys(prevModel[params.id] || {}).reduce(
            (acc, field) => ({
              ...acc,
              [field]: { mode: GridCellModes.View },
            }),
            {}
          ),
          [params.field]: { mode: GridCellModes.Edit },
        },
      };

      onGridEditing?.(true);
      refCellModesModel.current = newModel;
      return newModel;
    });
  }, [readOnlyCells, onGridEditing]);

  const handleProcessRowUpdate = useCallback((newRow: any) => {
    if (hasStore && setRows) {
      const getRowId = props.getRowId ?? ((r: any) => r.id);
      const newId = getRowId(newRow);
      setRows((prevRows) => {
        return prevRows.map((row) => (getRowId(row) === newId ? newRow : row));
      });
    }
    onProcessRowUpdate?.(newRow);
    onGridEditing?.(false);
    return newRow;
  }, [hasStore, setRows, onProcessRowUpdate, onGridEditing, props.getRowId]);

  // props
  const gridProps: Partial<DataGridProProps> = {
    localeText: {
      noRowsLabel: t("grid.no_row_label"),
    },
    disableColumnMenu: true,
    headerFilters: false,
    hideFooterSelectedRowCount: true,
    keepNonExistentRowsSelected: true,
    ...props,
  };


  const addRowByTabKey = useCallback(() => {
    const getRowId = props.getRowId ?? ((r: any) => r.id);
    const nextId = activeRows.length > 0
      ? Math.max(...activeRows.map((r: any) => {
        const idVal = Number(getRowId(r));
        return isNaN(idVal) ? 0 : idVal;
      })) + 1
      : 1;

    const newRow: any = { id: nextId };
    const editableFields = columns
      .filter((col) => col.editable)
      .map((col) => col.field);

    editableFields.forEach((f) => {
      newRow[f] = f === 'price' ? undefined : '';
    });

    if (hasStore && setRows) {
      setRows((prev) => [...prev, newRow]);
    }
    return nextId;
  }, [activeRows, columns, hasStore, setRows, props.getRowId]);

  const handleTabNavigation = useCallback((rowId: any, field: string, isShift: boolean, event: any) => {
    event.preventDefault();
    const columnsEditor = columns.filter(
      (c) => c.field !== 'actions' &&
        c.field !== '__check__' &&
        c.field !== '__reorder__' &&
        c.editable !== false
    );
    if (columnsEditor.length === 0) return;

    const currentColumnIndex = columnsEditor.findIndex((c) => c.field === field);
    if (currentColumnIndex === -1) return;

    const getRowId = props.getRowId ?? ((r: any) => r.id);
    let targetRowId = rowId;
    let targetField = '';
    let delay = 50;

    if (!isShift) {
      let nextIndex = currentColumnIndex + 1;
      while (
        nextIndex < columnsEditor.length &&
        readOnlyCells.filter(
          (c) => c.field === columnsEditor[nextIndex].field && c.row === rowId
        ).length > 0
      ) {
        nextIndex++;
      }

      if (nextIndex < columnsEditor.length) {
        targetField = columnsEditor[nextIndex].field;
      } else {
        // Đi xuống dòng tiếp theo
        const currentRowIndex = activeRows.findIndex((row) => getRowId(row) === rowId);
        if (currentRowIndex !== -1 && currentRowIndex + 1 < activeRows.length) {
          targetRowId = getRowId(activeRows[currentRowIndex + 1]);
          targetField = columnsEditor[0].field;
        } else {
          // Dòng cuối cùng: Thêm dòng mới
          targetRowId = addRowByTabKey();
          targetField = columnsEditor[0].field;
          delay = 120;
        }
      }
    } else {
      // shiftTab
      if (currentColumnIndex === 0) {
        const currentRowIndex = activeRows.findIndex((row) => getRowId(row) === rowId);
        if (currentRowIndex > 0) {
          targetRowId = getRowId(activeRows[currentRowIndex - 1]);
          targetField = columnsEditor[columnsEditor.length - 1].field;
        }
      } else {
        let nextIndex = currentColumnIndex - 1;
        while (
          nextIndex >= 0 &&
          readOnlyCells.filter(
            (c) => c.field === columnsEditor[nextIndex].field && c.row === rowId
          ).length > 0
        ) {
          nextIndex--;
        }
        if (nextIndex >= 0) {
          targetField = columnsEditor[nextIndex].field;
        }
      }
    }

    if (targetRowId !== null && targetField) {
      setTimeout(() => {
        setCellModesModel((prevModel) => ({
          ...Object.keys(prevModel).reduce(
            (acc, id) => ({
              ...acc,
              [id]: Object.keys(prevModel[id] || {}).reduce(
                (acc2, f) => ({
                  ...acc2,
                  [f]: { mode: GridCellModes.View },
                }),
                {}
              ),
            }),
            {}
          ),
          [targetRowId]: {
            ...prevModel[targetRowId],
            [targetField]: { mode: GridCellModes.Edit },
          },
        }));
        onGridEditing?.(true);
      }, delay);
    }
  }, [columns, readOnlyCells, addRowByTabKey, activeRows, props.getRowId, onGridEditing]);

  // Build editable columns — attach renderEditCell based on column type
  const buildEditableColumns = useCallback((baseCols: any[]) => {
    return baseCols.map((col) => {
      if (!col.editable || col.renderEditCell) col.editable = true;

      const colDef = columns.find((c) => c.field === col.field);
      const colType = colDef?.type;
      const decimalPlaces = colDef?.decimalPlaces ?? 2;
      const absNumber = colDef?.absNumber ?? false;
      const handleCellValueChange = colDef?.handleCellValueChange;
      const autocompleteStore = colDef?.store;
      const idField = colDef?.idField;
      const textField = colDef?.textField;

      switch (colType) {
        case EGridColTypes.NUMBER:
        case EGridColTypes.ABS_NUMBER:
          return {
            ...col,
            renderEditCell: (params: any) => (
              <CellEditNumber
                {...params}
                apiRef={apiRef}
                rowId={params.id}
                field={params.field}
                decimalScale={decimalPlaces}
                isAbs={colType === EGridColTypes.ABS_NUMBER || absNumber}
                handleChange={handleCellValueChange}
                autoRowHeight={autoRowHeight}
                onTabNavigation={handleTabNavigation}
              />
            ),
          };
        case EGridColTypes.TAREA:
          return {
            ...col,
            renderEditCell: (params: any) => (
              <CellEditText
                {...params}
                apiRef={apiRef}
                rowId={params.id}
                field={params.field}
                multiline
                autoRowHeight={autoRowHeight}
                onTabNavigation={handleTabNavigation}
              />
            ),
          };
        case EGridColTypes.AUTOCOMPLETE:
          return {
            ...col,
            renderEditCell: (params: any) => (
              <CellEditAutocomplete
                {...params}
                apiRef={apiRef}
                rowId={params.id}
                field={params.field}
                store={autocompleteStore}
                idField={idField}
                textField={textField}
                handleChange={handleCellValueChange}
                autoRowHeight={autoRowHeight}
                onTabNavigation={handleTabNavigation}
              />
            ),
          };
        default:
          return {
            ...col,
            renderEditCell: (params: any) => (
              <CellEditText
                {...params}
                apiRef={apiRef}
                rowId={params.id}
                field={params.field}
                multiline={false}
                autoRowHeight={autoRowHeight}
                onTabNavigation={handleTabNavigation}
              />
            ),
          };
      }
    });
  }, [columns, apiRef, autoRowHeight, handleTabNavigation]);

  //columns
  const gridColumns = useMemo(() => {
    const baseCols = getGridColumns(columns, disableRowSelectionOnClick);
    const editableCols = buildEditableColumns(baseCols);

    if (actionBars && actionBars.length > 0) {
      editableCols.push({
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
    return editableCols;
  }, [columns, disableRowSelectionOnClick, actionBars, handleActionClick, t, buildEditableColumns]);

  const gridPinnedColumns = useMemo(() => {
    if (props.pinnedColumns) {
      return props.pinnedColumns;
    }
    const pinned: { left?: string[]; right?: string[] } = {};
    if (actionBars && actionBars.length > 0) {
      pinned.right = ['actions'];
    }
    return pinned;
  }, [props.pinnedColumns, actionBars]);

  const handleCellEditStop = useCallback((params: GridCellEditStopParams, event: any) => {
    if (
      apiRef.current &&
      (apiRef.current as any)["dialogActive"] !== true &&
      (params.colDef?.type as string) !== "textarea"
    ) {
      return;
    }

    if (isKeyboardEvent(event) && !event.ctrlKey && !event.metaKey) {
      (event as any).defaultMuiPrevented = true;
    }

    if (apiRef.current) {
      (apiRef.current as any)["dialogActive"] = false;
      setTimeout(() => apiRef.current && apiRef.current.resetRowHeights(), 300);
    }
  }, [apiRef.current]);

  return (
    <Grid container size={12}
    >
      <Grid size={12}>
        <DataGridPro
          apiRef={apiRef}
          sx={{
            // height: height ?? getDefaultGridHeight(),
            ...dataGridStyles
          }}
          columns={gridColumns as any}
          rows={activeRows}
          initialState={initialState}
          rowHeight={ROW_HEIGHT}
          {...gridProps}
          pinnedColumns={gridPinnedColumns}
          loading={activeLoading}
          hideFooter
          getRowHeight={() => (autoRowHeight ? "auto" : ROW_HEIGHT)}
          checkboxSelection={false}
          rowReordering={rowReordering}
          onRowOrderChange={handleRowReorder}
          disableRowSelectionOnClick
          // --- Cell editing ---
          cellModesModel={cellModesModel}
          onCellModesModelChange={(model) => setCellModesModel(model)}
          onCellClick={handleCellClick}
          onCellEditStop={handleCellEditStop}
          processRowUpdate={handleProcessRowUpdate}
          onProcessRowUpdateError={(error) => console.error('Row update error:', error)}
        />
      </Grid>
    </Grid>
  )
}

export default DataTableForm;