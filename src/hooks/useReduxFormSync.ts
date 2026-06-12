import { useEffect, useRef } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

/**
 * Snapshot đại diện cho dữ liệu form và các trường đã bị thay đổi (dirtyFields) được lưu trong Redux.
 */
type Snapshot<TFormData extends FieldValues> = Partial<TFormData> & {
  dirtyFields?: Record<string, any>;
};

/**
 * Các thuộc tính cấu hình cho hook useReduxFormSync.
 */
type UseReduxFormSyncOptions<TFormData extends FieldValues> = {
  /** Các hàm và trạng thái trả về từ hook useForm() của react-hook-form */
  methods: UseFormReturn<TFormData>;
  /** Dữ liệu form snapshot lấy từ Redux Store */
  values?: Snapshot<TFormData> | null;
  /** Hàm callback để lưu snapshot mới vào Redux (thường dispatch một action) */
  onSave: (values: Snapshot<TFormData>) => void;
  /** Trạng thái kích hoạt đồng bộ (mặc định: true) */
  enabled?: boolean;
  /** Khôi phục trạng thái "dirty" (đã chỉnh sửa) của các trường nhập liệu từ Redux (mặc định: true) */
  restoreDirtyFields?: boolean;
  /** Lưu lại trạng thái "dirty" khi component unmount (mặc định: true) */
  saveDirtyFields?: boolean;
};

/**
 * Hook hỗ trợ đồng bộ hóa hai chiều (Two-way Sync) giữa React Hook Form và Redux State.
 * - Khi mount: Nạp dữ liệu từ Redux vào form (chỉ thực hiện 1 lần duy nhất để tránh lặp vô hạn).
 * - Khi unmount: Tự động lưu toàn bộ dữ liệu form hiện tại và trạng thái các trường đã sửa vào Redux.
 */
export const useReduxFormSync = <TFormData extends FieldValues>({
  methods,
  values,
  onSave,
  enabled = true,
  restoreDirtyFields = true,
  saveDirtyFields = true,
}: UseReduxFormSyncOptions<TFormData>) => {
  const { getValues, setValue } = methods;
  
  // Dùng ref để đảm bảo chỉ khôi phục dữ liệu từ Redux vào Form đúng 1 lần duy nhất khi mount
  const hydratedRef = useRef(false);
  
  // Dùng ref cho onSave để luôn gọi hàm onSave mới nhất mà không làm trigger useEffect unmount
  const onSaveRef = useRef(onSave);
  
  // Dùng ref để lưu trữ trạng thái dirtyFields mới nhất từ FormState
  const dirtyFieldsRef = useRef(methods.formState.dirtyFields);

  // Cập nhật hàm callback onSave khi nó thay đổi
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Cập nhật dirtyFieldsRef mỗi khi formState.dirtyFields của React Hook Form thay đổi
  useEffect(() => {
    dirtyFieldsRef.current = methods.formState.dirtyFields;
  }, [methods.formState.dirtyFields]);

  // LUỒNG 1 (RESTORING): Khôi phục dữ liệu từ Redux vào React Hook Form khi mount
  useEffect(() => {
    // Không chạy nếu tắt tính năng, đã nạp dữ liệu xong, hoặc không có dữ liệu để nạp
    if (!enabled || hydratedRef.current || !values) {
      return;
    }

    // Duyệt qua từng field trong snapshot của Redux để set vào form
    Object.entries(values).forEach(([key, value]) => {
      // Bỏ qua thuộc tính metadata dirtyFields
      if (key === 'dirtyFields') {
        return;
      }

      // Khôi phục giá trị của field và set trạng thái "dirty" tương ứng
      setValue(key as any, value as any, {
        shouldDirty: restoreDirtyFields && Boolean(values.dirtyFields?.[key]),
      });
    });

    // Đánh dấu đã hoàn thành việc nạp dữ liệu (hydration)
    hydratedRef.current = true;
  }, [enabled, restoreDirtyFields, setValue, values]);

  // LUỒNG 2 (SAVING): Tự động lưu dữ liệu hiện tại vào Redux khi component unmount
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Trả về cleanup function để tự động chạy khi component unmount
    return () => {
      onSaveRef.current({
        ...getValues(), // Lấy toàn bộ giá trị form hiện tại
        // Đính kèm danh sách các trường đã bị thay đổi nếu được cấu hình bật
        ...(saveDirtyFields ? { dirtyFields: dirtyFieldsRef.current } : {}),
      });
    };
  }, [enabled, getValues, saveDirtyFields]);
};

