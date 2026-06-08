import { Grid, SxProps } from '@mui/material';
import { 
  DataGridPro, 
  GridCellModesModel, 
  GridCellParams, 
  useGridApiRef, 
  DataGridProProps, 
  GridPaginationModel, 
  GridRowOrderChangeParams, 
  GridRowSelectionModel, 
  GridCallbackDetails, 
  GridCellModes,
 } from '@mui/x-data-grid-pro';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useStyles from './styles';
import { IGridColDef } from 'types/grid';
import { useTranslation } from 'react-i18next';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { date2Srting, datetime2Srting, number2String } from 'utils';
import { ILanguage } from 'types/commom';
import CellEditNumber from './CellEditNumber';
import CellEditText from './CellEditText';


type IDataTable = DataGridProProps & {
  height?: number;
  // buttons?: IButton[];
  // rightBtns?: IButton[];
  // getActionBars?: (rowId: any) => IButton[];
  // actionBars?: IButton[];
  // groupActionBars?: {
  //   label: string,
  //   buttons: IButton[]
  // }[];
  useI18n?: boolean;
  autoRowHeight?: boolean;
  parameters?: any;
  readOnlyCells?: {
    row: any;
    field?: string;
  }[];
  tableId?: string;
  forceEnableButtonsHeader?: boolean;
  handleButtonClick?: (key: string, rowId: any | any[]) => void;
  handleItemPaginationClick?: (key: string) => void;
  handlePagination?: (data: GridPaginationModel) => void;
  handleRowOrderChange?: (params: GridRowOrderChangeParams) => void;
  getData?: (params?: any, onSuccess?: (data) => void) => void;
  onProcessRowUpdate?: (row?) => void;
  addRowByTabKey?: () => void;
  handleDialogAdd?: (params) => void;
  handleRowSelectionModelChange?: (
    rowSelectionModel: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => void;
  onGridEditing?: (isEditing: boolean) => void;
  type?: 'default' | 'view' | 'edit';
  autoHeight?: boolean;
}

const currencies = [
  {
    currencycode: "USD",
    decimalplace: "2",
  },
  {
    currencycode: "JPY",
    decimalplace: "0",
  },
];

const info = {
  lbllanguage: "en"
}

const dummyColumns: IGridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'customerName', headerName: 'Customer', flex: 1, minWidth: 180, editable: true },
  { field: 'invoiceNo', headerName: 'Invoice No', width: 150, editable: true },
  { field: 'amount', headerName: 'Amount', width: 140, type: 'number', editable: true },
  { field: 'createdDate', headerName: 'Created Date', width: 140, type: 'date', editable: true }
];

const dummyRows = [
  { id: 1, customerName: 'Nguyen Van An', invoiceNo: 'INV-2026-001', amount: 1250000, createdDate: '2026-01-01' },
  { id: 2, customerName: 'Tran Thi Binh', invoiceNo: 'INV-2026-002', amount: 2890000, createdDate: '2026-01-02' },
  { id: 3, customerName: 'Le Hoang Duc', invoiceNo: 'INV-2026-003', amount: 790000, createdDate: '2026-01-03' },
  { id: 4, customerName: 'Pham Gia Huy', invoiceNo: 'INV-2026-004', amount: 4300000, createdDate: '2026-01-04' },
  { id: 5, customerName: 'Do Minh Khoa', invoiceNo: 'INV-2026-005', amount: 1560000, createdDate: '2026-01-05' }
];

const DataTableForm = ({ 
  columns, 
  rows, 
  apiRef: propApiRef,
  onCellClick,
  onGridEditing,
  readOnlyCells = [],
  tableId,
  onProcessRowUpdate,
}: IDataTable) => {
  const displayColumns = columns?.length ? columns : dummyColumns;
  const displayRows = rows?.length ? rows : dummyRows;
  const styles = useStyles();
  const { t, i18n } = useTranslation();
  const apiRef = propApiRef ?? useGridApiRef();
  const [dataRows, setDataRows] = useState(displayRows);
  const refCellModesModel = useRef<GridCellModesModel>({});
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});
  const [selections, setSelections] = useState<any[]>([]);
  const refNextColumn = useRef<{ rowId; field } | null>(null);



  const isEditMode = (model: GridCellModesModel) => {
    for (const k of Object.keys(model)) {
      for (const ck of Object.keys(model[k])) {
        if (model[k][ck].mode === "edit") return true;
      }
    }
    return false;
  };

  const buildColumns = useMemo(() => {
    const colItems: IGridColDef[] = displayColumns.map((col: IGridColDef) => {
      const {
        type,
        customType,
        valueFormatter,
        valueGetter,
        renderEditCell,
        decimalPlaces = 2,
        useI18n = true,
        formatNumberByCurrency = false,
        absNumber = false,
        ...colProps
      } = {
        ...col
      }

      const width = colProps.width
        ? colProps.width
        : type === "date"
          ? 110
          : (type === "dateTime" ? 150 : 100);
      const title = col.headerName
        ? useI18n
          ? t(col.headerName)
          : col.headerName
        : "";
      
      if (customType === "checkbox") {
        return {
          ...colProps,
          headerName: title,
          type,
          width,
          align: 'center',
          renderCell: (params) => params.value === 'Y'
            ? <CheckBox color="action" />
            : <CheckBoxOutlineBlank color="action" />
        }
      }

      return {
        ...colProps,
        headerName: title,
        type,
        width,
        valueGetter: valueGetter ?? ((value: any, row: any) => {
          const field = colProps.field as string;
          if (!field) return value;
          let result
          
          if (field.includes(".")) {
            const fields = field.split(".");
            result = row?.[fields[0]]?.[fields[1]];
          } else {
            result = row?.[field];
          }

          if (
            (customType === "date" ||
            type === "dateTime") &&
            typeof result === "string"
          ) {
            return new Date(result);
          }

          return result;
        }),
        valueFormatter: valueFormatter ?? ((value: string | number | Date, row) => {
          if (customType === "date") {
            const l = info
              ? info.lbllanguage
                ? info.lbllanguage
                : ILanguage.EN
              : ILanguage.EN;
            return date2Srting(value as Date, l as ILanguage);
          }
          if (type === "dateTime") {
            const l = info
              ? info.lbllanguage
                ? info.lbllanguage
                : ILanguage.EN
              : ILanguage.EN;
            return datetime2Srting(value as Date, l as ILanguage);
          }
          if (type === "number" && typeof value === "number") {
            const v = absNumber ? Math.abs(value) : value;
            if (formatNumberByCurrency && row?.currencycode) {
              const c = currencies.filter(
                (x) => x.currencycode === row.currencycode
              );
              if (c.length > 0 && c[0].decimalplace)
                return number2String(v, parseInt(c[0].decimalplace));
              else return number2String(v, decimalPlaces);
            }
            return number2String(v, decimalPlaces);
          }

          if (col.translateContent && typeof value === "string" && value?.trim() !== "") {
            return t(`${col.prexFixTranslate}.${value}`);
          }
          return value;
        }),

        renderEditCell: renderEditCell ?? ((params) => {
          if (col.editable === false) return null;

          if (type === "number") {
            return (
              <CellEditNumber
                value={params.value}
                hasFocus={params.hasFocus}
                apiRef={apiRef}
                rowId={params.id}
                field={params.field}
                decimalScale={decimalPlaces}
                isAbs={absNumber}
                handleChange={colProps.handleCellValueChange}
              />
            );
          }
          if (col.customType && col.customType === "textArea") {
            return (
              <CellEditText
                value={params.value}
                multiline={true}
                hasFocus={params.hasFocus}
                apiRef={apiRef}
                rowId={params.id}
                field={params.field}
              />
            );
          }

          return (
            <CellEditText
              value={params.value}
              multiline={false}
              hasFocus={params.hasFocus}
              apiRef={apiRef}
              rowId={params.id}
              field={params.field}
            />
          );
        })
      }
    });
    return colItems;
  }, [i18n.language, cellModesModel]);

  const handleCellClick = useCallback((params: GridCellParams, event, _detail) => {
    if (onCellClick) {
      onCellClick(params, event, _detail);
    }

    if (event.target.classList.contains("MuiAutocomplete-option")) {
        return;
    }
    if (params.isEditable === false) return;

    setCellModesModel((prevModel) => {
      const temp = {
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
        [params.id]: {
          // Revert the mode of other cells in the same row
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
      refCellModesModel.current = temp;

      return temp;
    });
  }, [readOnlyCells, tableId])
 
  const handleRowUpdate = useCallback((_newRow, _oldRow) => {
    setDataRows((prevRows) =>
      prevRows.map((row) => (row.id === _newRow.id ? _newRow : row))
    );

    onProcessRowUpdate?.(_newRow);
    onGridEditing?.(false);
    return _newRow;
  }, [onProcessRowUpdate, onGridEditing]);

  const dataGridStyles = useMemo(() => [
    styles.dataTableView,
    displayRows.length === 0
        ? {
          "& .MuiDataGrid-virtualScroller": {
            overflowY: "hidden !important",
          },
        }
        : {},
  ], [displayRows]) as SxProps;

  useEffect(() => {
    setSelections([]);

    // const convertRows = displayRows.map((row) => ({
    //   ...row,
    //   createdDate: row.createdDate ? new Date(row.createdDate) : null
    // }));
    // setDataRows(convertRows);
    setDataRows(displayRows);
  }, [JSON.stringify(displayRows)]);

  return (
    <Grid container size={12}>
      <DataGridPro 
        apiRef={apiRef}
        columns={buildColumns}
        rows={dataRows}
        hideFooter={true}
        sx={dataGridStyles}
        disableColumnMenu
        headerFilters={false}
        onCellClick={handleCellClick}
        processRowUpdate={handleRowUpdate}
      />
    </Grid>
  )
}

export default DataTableForm;