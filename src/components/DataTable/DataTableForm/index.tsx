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
import useStyles from '../styles';
import { IGridColDef } from 'types/components/grid';
import { useTranslation } from 'react-i18next';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { date2Srting, datetime2Srting, number2String } from 'utils';
import { ILanguage } from 'types/commom';
import CellEditNumber from '../CellEditNumber';
import CellEditText from '../CellEditText';


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
  const styles = useStyles();
  const { t, i18n } = useTranslation();
  const internalApiRef = useGridApiRef();
  const apiRef = propApiRef ?? internalApiRef;
  const [dataRows, setDataRows] = useState(rows);
  const refCellModesModel = useRef<GridCellModesModel>({});
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});

  const buildColumns = useMemo(() => {
    const colItems: IGridColDef[] = (columns as IGridColDef[]).map((col: IGridColDef) => {
      const {
        type,
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
      } as IGridColDef;

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

      if (type === "checkbox") {
        return {
          ...colProps,
          headerName: title,
          type: type as any,
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
            (type === "date" ||
              type === "dateTime") &&
            typeof result === "string"
          ) {
            return new Date(result);
          }

          return result;
        }),
        valueFormatter: valueFormatter ?? ((value: string | number | Date, row) => {
          if (type === "date") {
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
          if (col.type === "textArea") {
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
      prevRows?.map((row) => (row.id === _newRow.id ? _newRow : row))
    );

    onProcessRowUpdate?.(_newRow);
    onGridEditing?.(false);
    return _newRow;
  }, [onProcessRowUpdate, onGridEditing]);

  const dataGridStyles = useMemo(() => [
    styles.dataTableView,
    rows?.length === 0
      ? {
        "& .MuiDataGrid-virtualScroller": {
          overflowY: "hidden !important",
        },
      }
      : {},
  ], [rows]) as SxProps;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDataRows(rows);
  }, [JSON.stringify(rows)]);

  return (
    <Grid container size={12}>
      <DataGridPro
        apiRef={apiRef}
        columns={buildColumns as any}
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