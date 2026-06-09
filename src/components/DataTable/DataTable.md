# Hướng dẫn & Kiến trúc DataTable (MUI DataGridPro)

Tài liệu này giải thích chi tiết kiến trúc, luồng hoạt động và các quyết định kỹ thuật cốt lõi trong hệ thống `DataTable` của dự án. Hệ thống được chia thành 3 phần chính: Khai báo (DataTableForm), Hiển thị (DataTableView) và Quản lý State (useDataTable).

---

## 1. Tổng quan Kiến trúc

```mermaid
graph TD
    A[Trang/Component (ví dụ: Invoice)] -->|Truyền prop & SWR Store| B(DataTableForm / index)
    B -->|Bổ sung Actions/Slots| C(DataTableView)
    C -->|Render UI & Logic| D[MUI DataGridPro]
    E[useDataTable Hook] -.->|Cung cấp State, Loading, Pagination| C
    E -.->|Lưu trữ Checkbox State| F[(Global Selection Cache)]
```

- **`DataTableForm`**: Đóng vai trò lớp vỏ (Wrapper), xử lý các tuỳ chỉnh đặc thù như `columns`, biến tấu `actionBars` (nút Sửa, Xoá...) thành dạng cột ghim (pinned column), cấu hình i18n, v.v.
- **`DataTableView`**: Trái tim của giao diện, nơi gọi trực tiếp thẻ `<DataGridPro>`. Nó chịu trách nhiệm nhúng phân trang (Pagination), nhận state từ `useDataTable` và xử lý sự kiện Checkbox.
- **`useDataTable`**: Hook quản lý toàn bộ vòng đời Dữ liệu (SWR), Phân trang (Pagination) và Cache các hàng được tick chọn (Row Selection).

---

## 2. Giải thích chi tiết Logic & Code

### 2.1 Hook `useDataTable` (Quản lý State & Dữ liệu)

Đường dẫn: `src/hooks/useDataTable.ts`

```typescript
// 1. Khởi tạo một Map thuần tuý đóng vai trò làm Global Cache.
// Lý do: Tránh các lỗi Deep Equality của SWR khi lưu trữ Set object.
const globalSelectionCache = new Map<string, any>();
```
SWR có một thuật toán tự động huỷ render nếu nó phát hiện cấu trúc object truyền vào không thay đổi. Tuy nhiên, DataGrid lại có thói quen xào nấu lại chính cái Set cũ thay vì tạo mới. Dùng `Map` giúp ta vượt rào cản này, đảm bảo lưu trữ được checkbox qua các lần lật trang hoặc chuyển sang màn hình khác.

```typescript
// 2. Cấu hình SWR
const { data: resData, isLoading, isValidating, mutate } = useSWR(
  key,
  fetcher,
  {
    revalidateOnFocus: false,
    keepPreviousData: true, // QUAN TRỌNG: Ngăn chặn giật chớp (stuttering)
  }
);
```
- **`keepPreviousData: true`**: Khi người dùng lật trang mới (`key` của SWR thay đổi do `page` thay đổi), màn hình sẽ không bị xoá trắng. Nó giữ nguyên dữ liệu cũ kèm theo một lớp loading mờ, đến khi tải xong mới đắp dữ liệu mới lên. Mang lại trải nghiệm liền mạch (seamless).

```typescript
// 3. Quản lý Row Selection (Checkbox)
const [rowSelectionModel, setLocalRowSelectionModel] = useState<any>(() => {
  if (cacheKey && globalSelectionCache.has(cacheKey)) {
    return globalSelectionCache.get(cacheKey); // Đọc cache nếu có
  }
  // DataGrid yêu cầu bắt buộc cấu trúc Object này ở thời điểm runtime
  return { type: 'include', ids: new Set() }; 
});

const setRowSelectionModel = (model: any) => {
  setLocalRowSelectionModel(model); // Báo cho React render lại
  if (cacheKey) {
    globalSelectionCache.set(cacheKey, model); // Lưu ngầm vào bộ nhớ toàn cục
  }
};
```
Sự kết hợp giữa `useState` và `globalSelectionCache` đảm bảo 2 việc:
1. `useState` ép React **bắt buộc phải render lại** giao diện khi có thao tác click.
2. `globalSelectionCache` giữ cho dữ liệu không bị bay màu khi component bị unmount.

### 2.2 Component `DataTableView` (Giao diện hiển thị)

Đường dẫn: `src/components/DataTable/DataTableView/index.tsx`

```tsx
// 1. Tích hợp Hook useDataTable
const {
  rows: storeRows,
  rowCount: storeRowCount,
  loading: storeLoading,
  paginationModel: storePaginationModel,
  handlePaginationModelChange,
  rowSelectionModel: storeRowSelectionModel,
  setRowSelectionModel: setStoreRowSelectionModel,
} = useDataTable({ cacheKey: store?.cacheKey ?? '', ... });

// Ưu tiên dùng Store của hook nếu có, nếu không thì dùng Local State.
const activeRowSelectionModel = props.rowSelectionModel !== undefined 
  ? props.rowSelectionModel 
  : (hasStore && storeRowSelectionModel ? storeRowSelectionModel : localRowSelectionModel);
```

```tsx
// 2. Xử lý sự kiện click Checkbox
<DataGridPro
  rowSelectionModel={activeRowSelectionModel as any}
  onRowSelectionModelChange={(params, details) => {
    if (props.rowSelectionModel === undefined) {
      let newModel: any;
      
      // DataGrid có thể trả về Array hoặc Object tuỳ phiên bản/tình huống
      // Ta quy chuẩn hết về Object chuẩn của MUI để tránh lỗi crash `ids.size`
      if (Array.isArray(params)) {
        newModel = { type: 'include', ids: new Set(params) };
      } else {
        // Clone (sao chép) lại Set để đánh lừa cơ chế check của React,
        // buộc giao diện phải update ngay lập tức.
        newModel = { type: params?.type || 'include', ids: new Set(params?.ids || []) };
      }
      
      // Gọi hàm mutate của useDataTable (nơi lưu Global Cache)
      if (hasStore) {
        setStoreRowSelectionModel?.(newModel);
      } else {
        setLocalRowSelectionModel(newModel);
      }
    }
  }}
/>
```
**Sự cố và cách khắc phục ở bước này:**
- **Crash ứng dụng**: Ở phiên bản DataGridPro v9.x, truyền một mảng `[]` sẽ khiến DataGrid nội bộ bị crash do cố truy cập `[].ids.size`. Ta giải quyết bằng cách khởi tạo bằng Object chuẩn `{ type, ids: Set }`.
- **Checkbox bị trơ (Không sáng lên khi click)**: DataGrid xào lại object tham chiếu cũ khi click (Mutation). React thấy tham chiếu giống nhau nên từ chối render. Bằng cách viết dòng `new Set(params?.ids)`, ta cấp phát một vùng nhớ mới, buộc React phải vẽ lại màn hình.

### 2.3 `DataTableForm` (Bổ sung Actions/Phân quyền)

Đường dẫn: `src/components/DataTable/DataTableForm/index.tsx`

- Cột Actions (Edit, Delete, View) thay vì tự xây dựng từ đầu, chúng ta dùng trực tiếp `GridActionsCellItem` của MUI để có UX tốt nhất.
- Chuyển toàn bộ các tuỳ chọn tuỳ biến (`customType`, xử lý dropdown) thông qua prop vào thẳng các ô nhập liệu dạng Custom Component (`renderEditCell`).

---

## 3. Tổng kết quy trình lưu trữ Checkbox (Select Row)

1. Người dùng bấm chọn 1 dòng trên màn hình Invoice.
2. `DataGridPro` phát ra event `onRowSelectionModelChange` trả về `{ type: 'include', ids: Set([rowId]) }`.
3. `DataTableView` chặn bắt event này, tạo ra một Object mới và Set mới tinh chứa `rowId` đó.
4. Nó truyền ngược lại Object mới xuống `setStoreRowSelectionModel` (Hàm từ `useDataTable`).
5. Hàm này dùng `useState` cập nhật lại biến `rowSelectionModel` và đồng thời ghi đè Object đó vào `globalSelectionCache`.
6. Sự thay đổi `useState` kích hoạt Render. `DataGridPro` nhận được `rowSelectionModel` mới và cho hiển thị dấu tick xanh.
7. Người dùng bấm tab khác làm màn hình Invoice biến mất. Hook và State bị xoá.
8. Người dùng quay lại, `useDataTable` được khởi tạo lại, kiểm tra `globalSelectionCache` thấy còn dữ liệu -> Trả về dữ liệu cũ -> Bảng khôi phục lại tick xanh y như cũ.
