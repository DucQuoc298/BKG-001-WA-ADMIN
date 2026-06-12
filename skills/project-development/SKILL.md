---
name: project-development
description: Helps agents and developers implement features, Redux slices, Custom components, and Runtime Plugins in this Mantis Admin workspace.
---

# Kỹ năng Phát triển Dự án (Project Development Skill)

Tài liệu này cung cấp chỉ dẫn từng bước cho các tác nhân AI (Agents) và lập trình viên khi thực hiện các tác vụ phát triển, sửa đổi hoặc sửa lỗi (debugging) trong dự án Mantis Admin Dashboard & Runtime Plugins.

---

## 1. Phát triển Module Redux mới

Khi được yêu cầu tạo thêm một tính năng hoặc một trang mới có sử dụng Redux (ví dụ: `Customer`, `Order`, `Product`), hãy tuân thủ quy trình sau:

### Bước 1: Khai báo Phím Form (Form Key)
Mở file [form.ts](file:///Volumes/KINGSTON/Code/react-template/src/types/form.ts) và thêm định danh cho form vào enum `IFormKey`:
```typescript
export enum IFormKey {
  // ...
  CUSTOMER = "CUSTOMER",
}
```

### Bước 2: Tạo Redux Slice (`reducer.ts`)

Tạo file `reducer.ts` trong thư mục `src/store/customer/`. Tuân thủ đúng cấu trúc state phân cấp theo trang như sau:

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EFormMode } from 'types/form';

// 1. Khai báo FormFields — chỉ chứa giá trị trường nhập liệu
//    (Dùng làm kiểu dữ liệu cho useForm<CustomerFormFields>)
export type CustomerFormFields = {
  name: string;
  email: string;
};

// 2. Khai báo FormState — chứa data + dirtyFields + formMode
//    (Snapshot đầy đủ được lưu vào Redux)
export type CustomerFormState = {
  data: CustomerFormFields;
  dirtyFields: Record<string, any>;
  formMode: EFormMode;
};

// 3. (Tùy chọn) Khai báo ListState nếu module có trang danh sách
export type CustomerListState = {
  searchKeyword: string;
};

// 4. Khai báo IState tổng với cấu trúc phân cấp
export interface ICustomerState {
  loading: boolean;
  saving: boolean;
  error: any;
  message: any;
  customer: {             // Đặt tên trùng với tên module
    list: CustomerListState;
    form: CustomerFormState;
  };
}

const initialState: ICustomerState = {
  loading: false, saving: false, error: null, message: null,
  customer: {
    list: { searchKeyword: '' },
    form: {
      data: { name: '', email: '' },
      dirtyFields: {},
      formMode: EFormMode.VIEW,
    },
  },
};

const customerSlice = createSlice({
  name: 'customer', // Bắt buộc: IFormKey.CUSTOMER.toLowerCase()
  initialState,
  reducers: {
    updateCustomerForm: (state, action: PayloadAction<Partial<CustomerFormState>>) => {
      state.customer.form = {
        ...state.customer.form,
        ...action.payload,
        data: { ...state.customer.form.data, ...(action.payload.data ?? {}) },
      };
    },
    // BẮT BUỘC: reset[Key]Form để hook useFormActions tự động dispatch
    resetCustomerForm: (state) => {
      state.customer.form = initialState.customer.form;
    },
    updateCustomerList: (state, action: PayloadAction<Partial<CustomerListState>>) => {
      state.customer.list = { ...state.customer.list, ...action.payload };
    },
  },
});
```

### Bước 3: Tạo Selectors (`selector.ts`)

Tạo selectors có cấu trúc phân cấp tương ứng:

```typescript
// Chọn từng trang con riêng biệt
const selectCustomerFormState = createSelector(selectCustomerModule, ({ form }) => form);
const selectCustomerFormData = createSelector(selectCustomerFormState, ({ data }) => data);
const selectCustomerListState = createSelector(selectCustomerModule, ({ list }) => list);
```

### Bước 4: Tạo Custom Hook (`useCustomer.ts`)

Hook phân nhóm các state và action theo trang con:

```typescript
export const useCustomer = () => {
  const formState = useSelector(selectCustomerFormState);
  const updateForm = useCallback((data: Partial<CustomerFormState>) => dispatch(updateCustomerForm(data)), [dispatch]);
  const listState = useSelector(selectCustomerListState);
  return { formState, updateForm, listState };
};
```

### Bước 5: Sử dụng `useReduxFormSync` trong Component

```typescript
const { formState, updateForm } = useCustomer();

useReduxFormSync<CustomerFormFields>({
  methods,
  // Truyền data + dirtyFields làm snapshot để khôi phục form
  values: { ...(formState?.data ?? {}), dirtyFields: formState?.dirtyFields },
  // Khi unmount: lưu data + dirtyFields mới nhất vào Redux
  onSave: (snapshot) => {
    const { dirtyFields: savedDirtyFields, ...data } = snapshot;
    updateForm({ data: data as CustomerFormFields, dirtyFields: savedDirtyFields ?? {} });
  },
});
```

### Bước 6: Đăng ký Reducer vào Store
Mở file [createStore.ts](file:///Volumes/KINGSTON/Code/react-template/src/store/createStore.ts) và import reducer mới để chèn vào `rootReducer`.

---

## 2. Làm việc với DataTable & DataTableForm

Khi tích hợp danh sách hoặc bảng chỉnh sửa dữ liệu trực tiếp:

### Chế độ View (`variant: view`)
- Luôn truyền `store` (chứa `cacheKey`, `mode`, `fnGetData`, v.v.) vào DataTable để kích hoạt cơ chế tự động quản lý trạng thái SWR và Selection model qua Cache.
- Đảm bảo `cacheKey` là duy nhất cho mỗi bảng dữ liệu để tránh ghi đè chéo checkbox.

### Chế độ Chỉnh sửa trực tiếp (`variant: form`)
- Đối với các cột chỉnh sửa, khai báo đúng thuộc tính `type` trong `IGridColDef`:
  - `number`: Ô nhập số.
  - `absNumber`: Số tuyệt đối dương.
  - `textArea`: Nhập liệu văn bản dài nhiều dòng.
  - `autocomplete`: Bộ chọn tìm kiếm hỗ trợ Infinite Scroll (cần cấu hình thêm `store`, `idField`, `textField`).
- Để tự động chuyển ô khi bấm Tab hoặc Enter, đảm bảo các custom editor components gọi hàm `onTabNavigation` khi bắt sự kiện keydown của phím Tab.

---

## 3. Tạo và Xuất bản Dynamic Plugins

### Bước 1: Tạo mã nguồn
Tạo thư mục mới trong `plugin-form-builder/src/plugins/<ten-plugin>/` và tạo file `index.tsx`.
```tsx
import { definePlugin } from '../../types';

export const createPluginComponent = definePlugin(({ sdk }) => {
  const { Box, Typography } = sdk.components;
  return () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6">My Custom Plugin</Typography>
    </Box>
  );
});
```

### Bước 2: Đóng gói và Đẩy file local
1. Di chuyển vào thư mục builder: `cd plugin-form-builder`
2. Đóng gói plugin: `yarn build <ten-plugin>`
3. Phát hành sang host app: `yarn publish:local <ten-plugin>`

### Bước 3: Đăng ký Manifest
Thêm thông tin định tuyến vào `public/plugins/manifest.json`.

### Bước 4: Khai báo SDK Mapping ở Host App
Mở file [AppPlugin.tsx](file:///Volumes/KINGSTON/Code/react-template/src/runtime/AppPlugin.tsx), import SDK declaration và map `plugin.id` của bạn vào danh sách mappings.

---

## 4. Danh sách kiểm tra chất lượng (Verification Checklist)

Trước khi đánh giá tác vụ hoàn thành, hãy tự kiểm tra:
1. [ ] Bảng chỉnh sửa dòng có bị lỗi click checkbox không ăn hay không? (Nếu có, kiểm tra việc clone Set trong `onRowSelectionModelChange`).
2. [ ] Redux slice mới tạo có tự động reset khi đóng tab/form không? (Nếu không, kiểm tra quy ước tên slice và reducer reset).
3. [ ] Đã chạy `yarn lint` và `yarn build` ở root để kiểm tra lỗi kiểu dữ liệu TypeScript hay chưa?
4. [ ] Đối với plugin mới, đã chạy `yarn build <name>` và kiểm tra xem có import trực tiếp React hay MUI từ `node_modules` thay vì sử dụng `sdk` hay chưa?
