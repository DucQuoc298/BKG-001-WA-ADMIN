import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HomeFormState,
  HomeListState,
  updateHomeForm,
  updateHomeList,
} from "store/home/reducer";
import {
  selectHomeFormState,
  selectHomeListState,
  selectHomeLoading,
  selectHomeSaving,
} from "store/home/selector";

/**
 * Hook truy xuất và thao tác với Redux State của module Home.
 *
 * Được tổ chức thành các nhóm theo trang con:
 * - `form.*`: Dữ liệu và thao tác liên quan đến trang Form
 * - `list.*`: Dữ liệu và thao tác liên quan đến trang List
 * - `loading / saving`: Cờ trạng thái chung của module
 */
export const useHome = () => {
  const dispatch = useDispatch();

  // ── Trạng thái chung ──────────────────────────────────────
  const loading = useSelector(selectHomeLoading);
  const saving = useSelector(selectHomeSaving);

  // ── Trang FORM ────────────────────────────────────────────
  /** Toàn bộ state của trang form (data, dirtyFields, formMode) */
  const formState = useSelector(selectHomeFormState);

  /**
   * Cập nhật một phần state của form.
   * Dùng để persist snapshot khi `useReduxFormSync` lưu dữ liệu,
   * hoặc khi cần chỉnh sửa trực tiếp formMode từ component.
   *
   * @example
   * updateForm({ formMode: EFormMode.FORM });
   * updateForm({ data: { note: 'test' }, dirtyFields: { note: true } });
   */
  const updateForm = useCallback(
    (data: Partial<HomeFormState>) => {
      dispatch(updateHomeForm(data));
    },
    [dispatch]
  );

  // ── Trang LIST ────────────────────────────────────────────
  /** Toàn bộ state của trang list */
  const listState = useSelector(selectHomeListState);

  /**
   * Cập nhật một phần state của list.
   * @example
   * updateList({ searchKeyword: 'hello' });
   */
  const updateList = useCallback(
    (data: Partial<HomeListState>) => {
      dispatch(updateHomeList(data));
    },
    [dispatch]
  );

  return {
    // Cờ chung
    loading,
    saving,
    // Trang Form
    formState,
    updateForm,
    // Trang List
    listState,
    updateList,
  };
};