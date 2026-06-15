import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EmailFormState, updateEmailForm } from 'store/email/reducer';
import { selectEmailFormState } from 'store/email/selector';

/**
 * Hook truy xuất và thao tác với Redux State của module Email.
 */
export const useEmail = () => {
  const dispatch = useDispatch();

  // Chọn toàn bộ state của trang form (data, dirtyFields, formMode, isComposerOpen, isMinimized)
  const formState = useSelector(selectEmailFormState);

  /**
   * Cập nhật một phần state của form.
   * Dùng để persist snapshot khi `useReduxFormSync` lưu dữ liệu.
   */
  const updateForm = useCallback(
    (data: Partial<EmailFormState>) => {
      dispatch(updateEmailForm(data));
    },
    [dispatch]
  );

  return {
    formState,
    updateForm,
  };
};
