/** @format */

import React, { useMemo, useRef, memo } from "react";
import {
  Refresh
} from "@mui/icons-material";
import { Grid, IconButton, TextField, Typography } from "@mui/material";
import styles from "./styles";
import { IAction, IToolbarButton } from "types";
import { useTranslation } from "react-i18next";
import { Pagination as MuiPagination } from "@mui/material";
interface IPagination {
  paginationModel: { pageSize: number; page: number };
  totalRowCount?: number;
  handleButtonClick?: (key: IAction) => void;
  handleChangePage: (page: number) => void;
  handleChangePageSize: (pageSize: number) => void;
  buttons?: IToolbarButton[];
}

const Pagination = ({
  paginationModel,
  totalRowCount = 0,
  // handleButtonClick,
  handleChangePage,
  handleChangePageSize,
  // buttons,
}: IPagination) => {
  const { t } = useTranslation();
  const { page, pageSize } = paginationModel;
  const pageCount = Math.ceil(totalRowCount / pageSize);
  const pageSizeRef = useRef(null);
  const from = useMemo(
    () => (totalRowCount === 0 ? 0 : page * +pageSize + 1),
    [pageSize, page, totalRowCount]
  );
  const to = useMemo(
    () =>
      totalRowCount < pageSize || from + pageSize - 1 > totalRowCount
        ? totalRowCount
        : from + pageSize - 1,
    [pageSize, page, totalRowCount, from]
  );

  const handleChange = (_, value) => {
    handleChangePage(value - 1)
  };
  return (
    <Grid container size={12} sx={{ ...styles.pagination.container }}>
      <Grid sx={{ ...styles.pagination.rowPerPage }}>
        <Typography>{t("grid.row_per_page")}</Typography>
        <TextField
          inputRef={pageSizeRef}
          variant="outlined"
          type='number'
          sx={styles.pagination.numberField}
          defaultValue={pageSize}
          onKeyDown={(event) => {
            if (event.code === "Enter") {
              pageSizeRef.current &&
                (pageSizeRef.current as HTMLInputElement).blur();
            }
          }}
          onBlur={(event) => {
            const pSize = +event.target?.value;
            handleChangePageSize(pSize);
          }}
        />
        <Typography>{`${from} - ${to} ${t("grid.of")} ${totalRowCount}`}</Typography>
      </Grid>
      <Grid sx={{ ...styles.pagination.pagination }}>
        <MuiPagination page={page + 1} count={Math.ceil(pageCount)} shape="rounded" onChange={handleChange} />
        <IconButton
          onClick={() => {
            // handleButtonClick?.(IAction.REFRESH);
            console.log("Refresh");
          }}>
          <Refresh sx={{ height: 14, width: 14 }} fontSize="large" />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default memo(Pagination);
