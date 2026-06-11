# Quy tắc Phát triển Dự án (Project Coding Rules & Conventions)

Tài liệu này tổng hợp toàn bộ các quy tắc lập trình, quy ước đặt tên và các hướng dẫn kỹ thuật bắt buộc phải tuân thủ trong dự án. Mọi lập trình viên (và các AI Agent) cần đọc kỹ và áp dụng chính xác nhằm đảm bảo tính đồng nhất, hiệu năng và tránh các lỗi runtime.

---

## 1. Quy ước đặt tên Redux Slice để Tự động Reset Form

Dự án sử dụng hook `useFormActions` (`src/hooks/useForm.ts`) để tự động dọn dẹp (reset) dữ liệu form trong Redux Store khi người dùng đóng tab hoặc đóng form. Để cơ chế này hoạt động tự động không cần viết mã thủ công, hãy tuân thủ quy tắc sau:

1. **`name` của Slice**: Phải được đặt bằng dạng chữ thường của key trong enum `IFormKey` (khai báo tại `src/types/form.ts`).
   ```typescript
   // Nếu IFormKey.BILL = "BILL"
   const billSlice = createSlice({
     name: IFormKey.BILL.toLowerCase(), // Kết quả bắt buộc: 'bill'
     // ...
   ```
2. **Tên Reducer Reset**: Phải có định dạng `reset[Key]Form` với `Key` là tên dạng PascalCase tương ứng với `IFormKey`.
   ```typescript
   reducers: {
     resetBillForm: (state) => {
       state.form = initialState.form;
     }
   }
   ```
3. **Cách gọi reset trong Component**:
   ```typescript
   const { resetForm } = useFormActions();
   resetForm(IFormKey.BILL); // Sẽ tự động dispatch action type: 'bill/resetBillForm'
   ```

---

## 2. Quy tắc sử dụng UI Components & Styling

1. **Ưu tiên Reusable Components**: 
   - Không được tự viết lại các trường nhập liệu cơ bản. Hãy import các thành phần đã được tùy biến sẵn từ `src/components/` (Ví dụ: `TextField`, `SearchField`, `DatePicker`, `DataTable`, `Dialog`, `Snackbar`, v.v.).
2. **Quy tắc Styling (CSS)**:
   - Sử dụng CSS-in-JS thông qua các file `styles.ts` đặt cùng cấp component hoặc sử dụng Material UI theme token.
   - Hạn chế tối đa việc viết inline CSS (`style={{ ... }}`) trực tiếp trên thẻ JSX, trừ các giá trị tính toán động.
   - Không tự ý import các thư viện CSS bên thứ ba trừ khi được sự đồng ý của Technical Lead.

---

## 3. Quy tắc phát triển với DataTable (MUI DataGridPro)

Hệ thống DataTable được chia thành `DataTableView` (dành cho danh sách chỉ xem) và `DataTableForm` (dành cho form chỉnh sửa trực tiếp dạng lưới).

1. **Xử lý click Checkbox (Row Selection)**:
   - MUI DataGridPro trả về danh sách selection ở nhiều định dạng. Để tránh lỗi crash `.ids.size` trên mảng rỗng, bắt buộc phải chuẩn hóa kết quả về cấu trúc dạng: `{ type: 'include' | 'exclude', ids: Set }`.
   - **BẮT BUỘC** phải nhân bản đối tượng `Set` cũ khi cập nhật state:
     ```typescript
     const newModel = { type: 'include', ids: new Set(params) };
     ```
     *Lý do:* Tạo một tham chiếu vùng nhớ mới giúp React nhận diện sự thay đổi và kích hoạt re-render để hiển thị dấu tick xanh.
2. **Ghim cột (Pinned Columns)**:
   - Đối với danh sách hiển thị, luôn ghim cột Checkbox (`__check__`) ở bên trái (`left`) và cột hành động sửa/xóa (`actions`) ở bên phải (`right`) để tối ưu trải nghiệm cuộn ngang trên màn hình nhỏ.
3. **Di chuyển bằng phím Tab trong DataTableForm**:
   - Khi viết hoặc chỉnh sửa các Editor Component bên trong ô của bảng (`renderEditCell`), phải truyền thuộc tính `onTabNavigation` vào sự kiện `onKeyDown` để đảm bảo hành vi nhấn Tab chuyển ô và tự động thêm dòng mới được hoạt động trơn tru.

---

## 4. Quy tắc phát triển Runtime Plugins

Hệ thống cho phép cắm nóng các dynamic form thông qua file `.mjs`. Khi xây dựng plugin mới:

1. **Quy định Export**:
   - Một plugin module hợp lệ bắt buộc phải export component theo một trong hai cách:
     - `export default`: Trả về trực tiếp React Component.
     - `export const createPluginComponent`: Một factory function nhận đối tượng `sdk` làm tham số đầu vào và trả về React Component.
2. **Hạn chế Import trực tiếp từ thư viện ngoài**:
   - Để giữ dung lượng bundle của file `.mjs` siêu nhẹ, **không** import trực tiếp các thư viện lớn như `@mui/material`, `react`, `formik` từ `node_modules` bên trong mã nguồn plugin.
   - Hãy sử dụng các component và API được Host App tiêm vào qua đối tượng `sdk` (Ví dụ: `const { Box, Typography } = sdk.components;`).
3. **Khai báo SDK Mapping**:
   - Mọi plugin mới sau khi được khai báo trong `public/plugins/manifest.json` cần phải được ánh xạ (map) từ `plugin.id` sang SDK Runtime tương ứng trong file `src/runtime/AppPlugin.tsx`.
   - Nếu không ánh xạ, hệ thống sẽ sử dụng SDK mặc định (`demo-form`).

---

## 5. Quy trình Kiểm tra & Đóng gói trước khi Commit / Merge

1. **Biên dịch thử nghiệm tất cả Plugins**:
   - Vào thư mục builder và chạy lệnh build toàn bộ:
     ```bash
     cd plugin-form-builder
     yarn build:all
     ```
   - Đảm bảo không có lỗi cú pháp hoặc lỗi đóng gói Esbuild.
2. **Kiểm tra Host App**:
   - Quay lại thư mục gốc và chạy kiểm tra cú pháp và kiểu dữ liệu:
     ```bash
     yarn lint
     yarn build
     ```
   - Đảm bảo dự án không có lỗi cảnh báo đỏ của TypeScript (Type-check) và Linter.
3. **Bảo toàn Documentation**:
   - Không xóa hoặc chỉnh sửa các comment kiến trúc hoặc chú thích quan trọng trong mã nguồn trừ khi được yêu cầu rõ ràng.
