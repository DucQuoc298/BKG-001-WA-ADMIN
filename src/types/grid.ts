import { GridColDef } from "@mui/x-data-grid-pro";

export type IGridColDef = GridColDef & {
  hidden?: boolean;
  customType?: "textArea" | "checkbox" | "date";
  translateContent?: boolean;
  prexFixTranslate?: string;
  decimalPlaces?: number;
  formatNumberByCurrency?: boolean;
  absNumber?: boolean;
  handleCellValueChange?: (v, rowId) => void;
  useI18n?: boolean;
};