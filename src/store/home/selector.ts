import { createSelector } from "reselect";
import { IHomeState } from "store/home/reducer";

// ============================================================
// BASE SELECTOR
// ============================================================

/** Selector gốc – chọn toàn bộ slice state của module home */
const selectHomeSlice = (state: { home: IHomeState }) => state.home;

// ============================================================
// MODULE-LEVEL SELECTORS
// ============================================================

/** Chọn nhánh `home` (chứa tất cả các trang con: list, form...) */
const selectHomeModule = createSelector(
  selectHomeSlice,
  ({ home }) => home
);

/** Chọn cờ loading chung của module */
const selectHomeLoading = createSelector(
  selectHomeSlice,
  ({ loading }) => loading
);

/** Chọn cờ saving chung của module */
const selectHomeSaving = createSelector(
  selectHomeSlice,
  ({ saving }) => saving
);

// ============================================================
// PAGE-LEVEL SELECTORS — FORM
// ============================================================

/** Chọn toàn bộ state của trang Form */
const selectHomeFormState = createSelector(
  selectHomeModule,
  ({ form }) => form
);

/**
 * Chọn chỉ object `data` bên trong form state.
 * Đây là dữ liệu được sync với React Hook Form thông qua useReduxFormSync.
 */
const selectHomeFormData = createSelector(
  selectHomeFormState,
  ({ data }) => data
);

/** Chọn dirtyFields của form */
const selectHomeFormDirtyFields = createSelector(
  selectHomeFormState,
  ({ dirtyFields }) => dirtyFields
);

/** Chọn formMode của form */
const selectHomeFormMode = createSelector(
  selectHomeFormState,
  ({ formMode }) => formMode
);

// ============================================================
// PAGE-LEVEL SELECTORS — LIST
// ============================================================

/** Chọn toàn bộ state của trang List */
const selectHomeListState = createSelector(
  selectHomeModule,
  ({ list }) => list
);

/** Chọn searchKeyword của trang List */
const selectHomeListKeyword = createSelector(
  selectHomeListState,
  ({ searchKeyword }) => searchKeyword
);

// ============================================================
// EXPORTS
// ============================================================

export {
  selectHomeSlice,
  selectHomeModule,
  selectHomeLoading,
  selectHomeSaving,
  // Form
  selectHomeFormState,
  selectHomeFormData,
  selectHomeFormDirtyFields,
  selectHomeFormMode,
  // List
  selectHomeListState,
  selectHomeListKeyword,
};