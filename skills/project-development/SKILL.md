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
Tạo file `reducer.ts` trong thư mục `src/store/customer/`. Đảm bảo đặt tên Slice và Reducer Reset theo đúng quy ước:
```typescript
import { createSlice } from '@reduxjs/toolkit';
import { IFormKey } from 'types';

const initialState = {
  list: { searchKeyword: '', filters: {} },
  form: { mode: 'view', activeId: null, formData: {} }
};

const customerSlice = createSlice({
  name: IFormKey.CUSTOMER.toLowerCase(), // Bắt buộc: 'customer'
  initialState,
  reducers: {
    // Reducer reset bắt buộc đặt tên là resetCustomerForm
    resetCustomerForm: (state) => {
      state.form = initialState.form;
    }
  }
});
```

### Bước 3: Đăng ký Reducer vào Store
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
