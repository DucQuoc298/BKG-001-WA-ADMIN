import { GridColType, GridColDef } from "@mui/x-data-grid-pro";
import { formatDateTimeToString, formatDateToString, formatNumberToString } from "utils";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";

export type IGridColDef = Omit<GridColDef, 'type' | 'getActions'> & {
  hidden?: boolean;
  type?: TGridColTypes;
  getActions?: (params: any) => React.ReactElement[];
  translateContent?: boolean;
  prexFixTranslate?: string;
  decimalPlaces?: number;
  formatNumberByCurrency?: boolean;
  absNumber?: boolean;
  handleCellValueChange?: (v, rowId) => void;
  useI18n?: boolean;
};


export type TGridColTypes = GridColType | 'textArea' | 'checkbox' | 'absNumber';
export enum EGridColTypes {
  TEXT = "text",
  NUMBER = "number",
  DATE = "date",
  DATETIME = "dateTime",
  TAREA = "textArea",
  CHECKBOX = "checkbox",
  ABS_NUMBER = "absNumber",
  BOOLEAN = "boolean",
  SINGLE_SELECT = "singleSelect",
  ACTIONS = "actions",
  CUSTOM = "custom",
  LONG_TEXT = "longText",
}

export const getGridColumns = (
  columns: IGridColDef[],
  _disableRowSelectionOnClick = false
) => {
  return columns?.map((column: IGridColDef) => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      type,
      valueFormatter,
      valueGetter,
      renderEditCell,
      decimalPlaces = 0,
      useI18n = true,
      formatNumberByCurrency = false,
      absNumber = false,
      ...colProps
    } = {
      ...column,
    };
    /* eslint-enable @typescript-eslint/no-unused-vars */
    if (type === 'checkbox') {
      return {
        ...colProps,
        align: 'center',
        renderCell: (params: any) => params.value === 'Y' || params.value === true
          ? <CheckBox color="action" />
          : <CheckBoxOutlineBlank color="action" />

      }
    } else if (type === EGridColTypes.ACTIONS) {
      return {
        ...colProps,
        type: 'actions',
        getActions: column.getActions
      };
    } else {
      const isNumeric = type === EGridColTypes.NUMBER || type === EGridColTypes.ABS_NUMBER;
      return {
        ...colProps,
        type: isNumeric ? 'number' : type,
        align: colProps?.align ?? (isNumeric ? 'right' : undefined),
        headerAlign: colProps?.headerAlign ?? (isNumeric ? 'right' : undefined),
        valueGetter: valueGetter ?? ((value: any, row: any) => {
          const { field } = colProps;
          if (!field) return value;
          let result;
          if (field.indexOf(".") > -1) {
            const fields = field.split(".");
            if (row && row[fields[0]]) {
              result = row[fields[0]][fields[1]];
            } else result = "";
            return result;
          }
          return row ? row[field] : value;
        }),
        valueFormatter: valueFormatter ?? ((value: any, _row: any) => {
          const numVal = typeof value === 'string' ? parseFloat(value) : value;
          switch (type) {
            case EGridColTypes.DATE:
              return formatDateToString(value);
            case EGridColTypes.DATETIME:
              return formatDateTimeToString(value);
            case EGridColTypes.ABS_NUMBER: {
              const finalAbsNum = Math.abs(numVal);
              return isNaN(finalAbsNum) ? value : formatNumberToString(finalAbsNum, decimalPlaces);
            }
            case EGridColTypes.NUMBER: {
              const finalNum = absNumber ? Math.abs(numVal) : numVal;
              return isNaN(finalNum) ? value : formatNumberToString(finalNum, decimalPlaces);
            }
            default:
              return value;
          }
        })
      }
    }
  })
}

