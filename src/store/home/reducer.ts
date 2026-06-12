
import { PickerValue } from '@mui/x-date-pickers/internals';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EFormMode } from 'types/form';

// ============================================================
// TYPE DEFINITIONS
// ============================================================

/**
 * Kiểu dữ liệu của các trường trong Form chính của trang Home.
 * Không chứa `dirtyFields` hay `formMode` – những thông tin này
 * được tách riêng ra cấp trên để dễ quản lý và mở rộng.
 */
export type HomeFormFields = {
  note: string;
  product?: string | null;
  products?: string[] | null;
  date?: PickerValue | null;
  fromDate?: Date | null;
  toDate?: Date | null;
  number?: number | null;
};

/**
 * Trạng thái của một Form ngang cấp trong module Home.
 * Mỗi form nhỏ bên trong trang có thể được mở rộng tương tự.
 *
 * - `data`: Giá trị thực của các trường nhập liệu (để sync với React Hook Form).
 * - `dirtyFields`: Danh sách các trường đã bị thay đổi so với giá trị gốc.
 * - `formMode`: Chế độ hiện tại của form (xem, chỉnh sửa, tạo mới...).
 */
export type HomeFormState = {
  data: HomeFormFields;
  dirtyFields: Record<string, any>;
  formMode: EFormMode;
};

/**
 * Trạng thái của trang List trong module Home.
 * Khai báo thêm các state liên quan đến danh sách tại đây.
 */
export type HomeListState = {
  searchKeyword: string;
};

/**
 * State tổng hợp các trang ngang cấp bên trong module Home.
 * Mỗi thuộc tính tương ứng với một trang/tab ngang cấp (list, form...).
 */
export type HomeModuleState = {
  /** Trạng thái của trang danh sách */
  list: HomeListState;
  /** Trạng thái của trang form */
  form: HomeFormState;
};

/**
 * Interface chính của toàn bộ Redux State cho module Home.
 *
 * - `loading / saving / error / message`: Các cờ trạng thái chung dùng
 *   cho API calls (fetch, save, xóa...) của cả module.
 * - `home`: Chứa state của từng trang ngang cấp (list, form...).
 */
export interface IHomeState {
  loading: boolean;
  saving: boolean;
  error: any;
  message: any;
  home: HomeModuleState;
}

// ============================================================
// INITIAL STATE
// ============================================================

/** Giá trị khởi tạo ban đầu của form */
export const initialHomeFormFields: HomeFormFields = {
  note: '',
  product: null,
  products: null,
  date: null,
  fromDate: null,
  toDate: null,
  number: 0,
};

/** State khởi tạo của form, bao gồm cả dirtyFields và formMode */
export const initialHomeFormState: HomeFormState = {
  data: initialHomeFormFields,
  dirtyFields: {},
  formMode: EFormMode.VIEW,
};

const initialState: IHomeState = {
  loading: false,
  saving: false,
  error: null,
  message: null,
  home: {
    list: {
      searchKeyword: '',
    },
    form: initialHomeFormState,
  },
};

// ============================================================
// SLICE
// ============================================================

const homeSlice = createSlice({
  name: 'home', // Phải khớp với IFormKey.HOME.toLowerCase() = 'home'
  initialState,
  reducers: {
    /**
     * Cập nhật một phần dữ liệu của form (data, dirtyFields, formMode).
     * Dùng để persist state khi người dùng nhập liệu hoặc khi useReduxFormSync lưu snapshot.
     */
    updateHomeForm: (state, action: PayloadAction<Partial<HomeFormState>>) => {
      state.home.form = {
        ...state.home.form,
        ...action.payload,
        // Merge sâu data để tránh ghi đè toàn bộ object khi chỉ cập nhật một phần
        data: {
          ...state.home.form.data,
          ...(action.payload.data ?? {}),
        },
      };
    },

    /**
     * Reset toàn bộ form về trạng thái ban đầu.
     * TÊN BẮT BUỘC: `reset[Key]Form` = `resetHomeForm` để hook
     * `useFormActions` có thể tự động dispatch đúng action.
     */
    resetHomeForm: (state) => {
      state.home.form = initialState.home.form;
    },

    /** Cập nhật trạng thái của trang List */
    updateHomeList: (state, action: PayloadAction<Partial<HomeListState>>) => {
      state.home.list = {
        ...state.home.list,
        ...action.payload,
      };
    },
  },
});

export const { updateHomeForm, resetHomeForm, updateHomeList } = homeSlice.actions;
export default homeSlice.reducer;
