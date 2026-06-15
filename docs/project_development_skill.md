# Kỹ năng Phát triển Dự án (Project Development Skill)

Tài liệu này cung cấp chỉ dẫn từng bước cho các tác nhân AI (Agents) và lập trình viên khi thực hiện các tác vụ phát triển, sửa đổi hoặc sửa lỗi (debugging) trong dự án Mantis Admin Dashboard & Runtime Plugins.

> **Lưu ý cho AI Agent:** Đọc toàn bộ tài liệu này trước khi viết bất kỳ dòng code nào. Mọi quy ước trong tài liệu này đều bắt buộc. Xem thêm [project_rules.md](file:///Volumes/KINGSTON/Code/react-template/docs/project_rules.md) và [agents.md](file:///Volumes/KINGSTON/Code/react-template/docs/agents.md) để biết toàn cảnh dự án.

---

## 0. Định hướng nhanh về dự án

| Thành phần | Công nghệ | Vị trí |
|---|---|---|
| Framework | React 19 + Vite 8 + TypeScript | `src/` |
| UI | Material UI v9 | `src/components/` |
| State | Redux Toolkit + Redux Saga + SWR | `src/store/` |
| Form | React Hook Form + Yup | hook `useReduxFormSync` |
| i18n | i18next | `src/i18n/` |
| Plugin Engine | ESM `.mjs` Dynamic Import | `src/runtime/`, `public/plugins/` |
| Plugin Builder | Esbuild | `plugin-form-builder/` |

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
  // BẮT BUỘC: name = IFormKey.CUSTOMER.toLowerCase() → 'customer'
  // Quy ước này giúp hook useFormActions tự động dispatch action reset khi đóng tab
  // resetForm(IFormKey.CUSTOMER) → auto dispatch 'customer/resetCustomerForm'
  name: IFormKey.CUSTOMER.toLowerCase(),
  initialState,
  reducers: {
    updateCustomerForm: (state, action: PayloadAction<Partial<CustomerFormState>>) => {
      state.customer.form = {
        ...state.customer.form,
        ...action.payload,
        data: { ...state.customer.form.data, ...(action.payload.data ?? {}) },
      };
    },
    // BẮT BUỘC: Tên phải là reset[Key]Form (PascalCase) để useFormActions hoạt động
    resetCustomerForm: (state) => {
      state.customer.form = initialState.customer.form;
    },
    updateCustomerList: (state, action: PayloadAction<Partial<CustomerListState>>) => {
      state.customer.list = { ...state.customer.list, ...action.payload };
    },
  },
});
```

> **Tại sao tách `FormFields` và `FormState`?**
> - `XxxFormFields`: Chỉ chứa giá trị trường — dùng làm type cho `useForm<XxxFormFields>()`.
> - `XxxFormState`: Bao gồm `data`, `dirtyFields`, `formMode` — snapshot đầy đủ để lưu/khôi phục qua `useReduxFormSync`.
> - Trộn `dirtyFields`/`formMode` vào `FormFields` sẽ gây lỗi type khi truyền vào React Hook Form.

### Bước 3: Tạo Selectors (`selector.ts`)

Tạo selectors có cấu trúc phân cấp tương ứng:

```typescript
const selectCustomerState = (state: RootState) => state.customer;
const selectCustomerModule = createSelector(selectCustomerState, ({ customer }) => customer);

// Chọn từng trang con riêng biệt
const selectCustomerFormState = createSelector(selectCustomerModule, ({ form }) => form);
const selectCustomerFormData = createSelector(selectCustomerFormState, ({ data }) => data);
const selectCustomerListState = createSelector(selectCustomerModule, ({ list }) => list);
```

### Bước 4: Tạo Custom Hook (`useCustomer.ts`)

Hook phân nhóm các state và action theo trang con:

```typescript
export const useCustomer = () => {
  const dispatch = useDispatch();
  const formState = useSelector(selectCustomerFormState);
  const listState = useSelector(selectCustomerListState);
  const updateForm = useCallback(
    (data: Partial<CustomerFormState>) => dispatch(updateCustomerForm(data)),
    [dispatch]
  );
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

## 2. Quy tắc UI Components & Styling

1. **Ưu tiên Reusable Components**: Không tự viết lại các trường nhập liệu cơ bản. Import từ `src/components/` những gì đã được tùy biến sẵn: `TextField`, `SearchField`, `DatePicker`, `DataTable`, `Dialog`, `Snackbar`, v.v.
2. **Quy tắc Styling (CSS)**:
   - Sử dụng CSS-in-JS thông qua các file `styles.ts` đặt cùng cấp component hoặc sử dụng Material UI theme token.
   - **Hạn chế tối đa** inline CSS (`style={{ ... }}`), chỉ dùng cho các giá trị tính toán động.
   - Không tự ý import các thư viện CSS bên thứ ba trừ khi được Technical Lead chấp thuận.

---

## 3. Làm việc với DataTable & DataTableForm

Hệ thống DataTable bao gồm `DataTableView` (chỉ xem) và `DataTableForm` (chỉnh sửa trực tiếp dạng lưới).

### 3.1 Xử lý click Checkbox (Row Selection) — BẮT BUỘC
MUI DataGridPro trả về selection model ở nhiều định dạng. **Bắt buộc phải nhân bản `Set`** khi cập nhật state để React nhận diện thay đổi và kích hoạt re-render:
```typescript
// ĐÚNG: Tạo tham chiếu vùng nhớ mới → React re-render, dấu tick xanh hiển thị
const newModel = { type: 'include', ids: new Set(params) };

// SAI: Tham chiếu cũ → React bỏ qua update, checkbox không tick
const newModel = { type: 'include', ids: existingSet };
```
Chuẩn hóa kết quả về dạng: `{ type: 'include' | 'exclude', ids: Set }` để tránh crash `.ids.size` trên mảng rỗng.

### 3.2 Ghim cột (Pinned Columns) — BẮT BUỘC
Đối với mọi DataTable dạng danh sách, luôn ghim:
- Cột Checkbox (`__check__`) ở bên **trái** (`left`)
- Cột hành động sửa/xóa (`actions`) ở bên **phải** (`right`)

### 3.3 Chế độ View (`variant: view`)
- Luôn truyền `store` (chứa `cacheKey`, `mode`, `fnGetData`, v.v.) vào DataTable để kích hoạt cơ chế tự động quản lý trạng thái SWR và Selection model qua Cache.
- `cacheKey` phải **duy nhất** cho mỗi bảng dữ liệu để tránh ghi đè chéo checkbox giữa các bảng.

### 3.4 Chế độ Chỉnh sửa trực tiếp (`variant: form`) — DataTableForm
Khai báo đúng thuộc tính `type` trong `IGridColDef`:
- `number`: Ô nhập số.
- `absNumber`: Số tuyệt đối dương.
- `textArea`: Nhập liệu văn bản dài nhiều dòng.
- `autocomplete`: Bộ chọn tìm kiếm hỗ trợ Infinite Scroll (cần cấu hình thêm `store`, `idField`, `textField`).

Để tự động chuyển ô khi bấm Tab hoặc Enter, **bắt buộc** các custom editor components phải gọi hàm `onTabNavigation` trong sự kiện `onKeyDown` của phím Tab.

---

## 4. Tạo và Xuất bản Dynamic Plugins

### Bước 1: Tạo mã nguồn plugin
Tạo thư mục mới trong `plugin-form-builder/src/plugins/<ten-plugin>/` và tạo file `index.tsx`.
```tsx
import { definePlugin } from '../../types';

export const createPluginComponent = definePlugin(({ sdk }) => {
  // BẮT BUỘC: Lấy components từ sdk, KHÔNG import trực tiếp từ @mui/material hay react
  const { Box, Typography } = sdk.components;
  return () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6">My Custom Plugin</Typography>
    </Box>
  );
});
```

> **Quy định Export hợp lệ** — Plugin module phải export theo một trong hai cách:
> - `export default`: Trả về trực tiếp React Component.
> - `export const createPluginComponent`: Factory function nhận `sdk` và trả về React Component.

> **Cấm import thư viện ngoài**: KHÔNG import `@mui/material`, `react`, `formik` trực tiếp từ `node_modules` trong mã nguồn plugin. Dùng các API được tiêm qua `sdk` để giữ bundle `.mjs` siêu nhẹ.

### Bước 2: Đóng gói và Đẩy file local
```bash
cd plugin-form-builder
yarn build <ten-plugin>        # Biên dịch thành .mjs
yarn publish:local <ten-plugin> # Đẩy sang public/plugins/
```

### Bước 3: Đăng ký Manifest
Thêm thông tin định tuyến vào `public/plugins/manifest.json`, đảm bảo `enabled: true` và `routePath` khớp với URL:
```json
{
  "id": "ten-plugin",
  "routePath": "/user-forms/ten-plugin",
  "file": "ten-plugin.mjs",
  "enabled": true
}
```

### Bước 4: Khai báo SDK Mapping ở Host App
Mở file [AppPlugin.tsx](file:///Volumes/KINGSTON/Code/react-template/src/runtime/AppPlugin.tsx), import SDK declaration và map `plugin.id` của bạn vào danh sách mappings.

> **Lưu ý:** Nếu không map, hệ thống fallback về SDK mặc định của `demo-form`. Plugin sẽ chạy nhưng có thể thiếu các service chuyên biệt.

---

## 5. Giao tiếp Chéo Tab (BroadcastChannel)

Dự án hỗ trợ đồng bộ hóa trạng thái giữa các tab trình duyệt qua `BroadcastChannel` (được bọc trong `src/services/broadcast.ts` và hook `useBroadcastChannel`).

### 5.1 Sử dụng Hook `useBroadcastChannel`

**Vừa lắng nghe vừa gửi:**
```typescript
const { postMessage } = useBroadcastChannel((message) => {
  if (message.type === BroadcastEventTypes.AUTH_LOGOUT) {
    // Xử lý sự kiện nhận được từ tab khác
  }
});
```

**Chỉ gửi (không cần lắng nghe) — BẮT BUỘC gọi không tham số:**
```typescript
// ĐÚNG: Không sinh Event Listener ẩn trên tab hiện tại
const { postMessage } = useBroadcastChannel();

// SAI: Truyền callback rỗng vẫn sinh listener không cần thiết
const { postMessage } = useBroadcastChannel(() => {});
```

### 5.2 Quy định về Event Types
Mọi sự kiện chéo tab **bắt buộc** phải được khai báo trong `BroadcastEventTypes` tại [broadcast.ts](file:///Volumes/KINGSTON/Code/react-template/src/services/broadcast.ts). Không sử dụng magic strings.

### 5.3 Tích hợp SDK cho Dynamic Plugins
Các plugin runtime truy cập BroadcastChannel qua `sdk.broadcast`:
```typescript
sdk.broadcast.postMessage({ type: BroadcastEventTypes.SOME_EVENT, payload: data });
sdk.broadcast.subscribe((message) => { /* xử lý */ });
```

---

## 6. Quy trình Kiểm tra & Đóng gói trước khi Commit

Thực hiện **đầy đủ 3 bước** sau trước khi coi tác vụ là hoàn thành:

### Bước 1: Biên dịch tất cả Plugins
```bash
cd plugin-form-builder
yarn build:all
```
Đảm bảo không có lỗi cú pháp hay lỗi Esbuild.

### Bước 2: Kiểm tra Host App
```bash
# Quay về thư mục gốc
yarn lint    # Kiểm tra lỗi Linter
yarn build   # Type-check TypeScript + Build production
```
Đảm bảo không có lỗi cảnh báo đỏ TypeScript hay Linter.

### Bước 3: Bảo toàn Documentation
Không xóa hoặc chỉnh sửa các comment kiến trúc hay chú thích quan trọng trong mã nguồn trừ khi được yêu cầu rõ ràng.

---

## 7. Danh sách kiểm tra chất lượng (Verification Checklist)

Trước khi đánh giá tác vụ hoàn thành, hãy tự kiểm tra từng mục:

**Redux:**
- [ ] `name` của slice có bằng `IFormKey.XXX.toLowerCase()` không?
- [ ] Reducer reset có tên đúng dạng `reset[Key]Form` không?
- [ ] Redux slice mới có tự động reset khi đóng tab/form không? (kiểm tra `useFormActions`)

**DataTable:**
- [ ] Checkbox click có hoạt động không? (Kiểm tra `new Set(params)` trong `onRowSelectionModelChange`)
- [ ] Cột Checkbox và Actions đã được ghim trái/phải chưa?
- [ ] Các custom editor cell có gọi `onTabNavigation` trong `onKeyDown` chưa?

**Plugin:**
- [ ] Plugin có export đúng chuẩn (`default` hoặc `createPluginComponent`) không?
- [ ] Có import trực tiếp `react`/`@mui/material` từ `node_modules` thay vì `sdk` không?
- [ ] Đã thêm vào `manifest.json` với `enabled: true` chưa?
- [ ] Đã map `plugin.id` vào `AppPlugin.tsx` chưa?

**Tổng thể:**
- [ ] Đã chạy `cd plugin-form-builder && yarn build:all` không có lỗi?
- [ ] Đã chạy `yarn lint` và `yarn build` ở root không có lỗi TypeScript?
