# Hướng dẫn AI & Tổng quan cấu trúc dự án (Mantis Free React Admin Template + Runtime Plugins)

Tài liệu này cung cấp cái nhìn tổng quan về kiến trúc dự án, cấu trúc thư mục, quy trình phát triển và các quy ước kỹ thuật cần tuân thủ dành cho nhà phát triển và các tác nhân AI.

---

## 1. Tổng quan dự án

Dự án là một hệ thống Admin Dashboard được xây dựng trên nền tảng **Mantis Free React Admin Template**, tích hợp kiến trúc **Runtime Plugin Forms**.

Hệ thống được chia làm 2 phần chính:
1. **Host App (Ứng dụng chính - Thư mục gốc):**
   - Đóng vai trò là lớp vỏ (Shell) chứa layout chính, phân quyền, route tĩnh (`/`, `/invoice`, `/bill`), global state (Redux), i18n và theme.
   - Có khả năng tải động (Dynamic Import) các form/mô-đun chức năng ở dạng file `.mjs` tại runtime dựa trên cấu hình khai báo trong `manifest.json`.
2. **Plugin Builder (Trình đóng gói plugin - thư mục `plugin-form-builder/`):**
   - Cho phép phát triển các form/mô-đun độc lập bằng React + TypeScript.
   - Sử dụng **Esbuild** để bundle code nguồn thành định dạng ESM (`.mjs`) độc lập và xuất bản (publish) trực tiếp vào thư mục `public/plugins/` của Host App.

---

## 2. Công nghệ sử dụng (Tech Stack)

- **Framework & Runtime:** React 19, Vite 8, TypeScript (TSX/TS).
- **Giao diện (UI Library):** Material UI (MUI v9), Ant Design Icons (`@ant-design/icons`), Framer Motion (hiệu ứng).
- **Quản lý trạng thái (State Management):** Redux Toolkit (với Redux Saga & Redux Persist), SWR (cho việc quản lý state/cache local).
- **Xử lý Form & Validation:** Formik, React Hook Form, Yup.
- **Quốc tế hóa:** i18next + React i18next.
- **Trình đóng gói phụ trợ:** Esbuild (sử dụng trong `plugin-form-builder`).

---

## 3. Cấu trúc thư mục chi tiết

```text
react-template/ (Host App)
├── .cert/                     # Khóa SSL tự cấp để chạy HTTPS cục bộ (key.pem, cert.pem)
├── public/                    # Thư mục chứa asset tĩnh
│   └── plugins/               # Thư mục lưu trữ tài nguyên plugin chạy động
│       ├── manifest.json      # File cấu hình đăng ký danh sách các plugin hiện có
│       └── *.mjs              # Các file plugin sau khi được biên dịch (VD: demo-form.mjs)
├── src/                       # Source code của ứng dụng chính
│   ├── assets/                # Ảnh, font và style tĩnh
│   ├── components/            # Các UI component dùng chung có tính tái sử dụng cao
│   │   ├── Autocomplete/      # Thành phần Autocomplete tuyển chọn
│   │   ├── Buttons/           # Nút bấm tùy chỉnh
│   │   ├── DataTable/         # Bảng hiển thị dữ liệu nâng cao
│   │   ├── Dialog/            # Hộp thoại modal
│   │   ├── Inputs/            # Các trường nhập liệu tiêu chuẩn
│   │   ├── MainCard.tsx       # Component khung bao bọc (Card) chuẩn của template
│   │   ├── Loader.tsx         # Hiệu ứng tải trang (Spinner/Progress)
│   │   └── Snackbar.tsx       # Hiển thị thông báo Toast nhanh
│   ├── contexts/              # Các Context API (ConfigContext, Theme...)
│   ├── hooks/                 # Custom React Hooks dùng chung (useForm, useLocalStorage...)
│   ├── i18n/                  # Cấu hình đa ngôn ngữ (vi, en...)
│   ├── layout/                # Layout của hệ thống (MainLayout gồm Header, Drawer, Footer)
│   ├── menu-items/            # Khai báo cấu trúc sidebar menu của Admin
│   ├── pages/                 # Các trang tĩnh được định nghĩa sẵn
│   │   ├── auth/              # Các trang Login, Register...
│   │   └── main/              # Các trang chính như Home, Bill, Invoice...
│   ├── routes/                # Cấu hình định tuyến (React Router)
│   ├── runtime/               # Engine chạy plugin động (Plugin Loader, SDK)
│   │   ├── LoadFormRuntime/   # Component xử lý tải plugin & render dynamic component
│   │   ├── AppPlugin.tsx      # createAppRuntime(pluginId) — entry point duy nhất, dùng generic runtime
│   │   ├── services/          # Các service hỗ trợ runtime (manifest loader, plugin importer)
│   │   └── types/             # Type definitions + genericRuntime.ts (factory tạo SDK cho mọi plugin)
│   ├── services/              # Các service của ứng dụng (API & Client-side Utils)
│   │   ├── api/               # Các business API services (authorization.ts, ...)
│   │   └── utils/             # Các utility services (axios.ts, signalr.ts, broadcast.ts, navigation.ts)
│   ├── store/                 # Cấu hình Redux Store, Middleware, Root Saga
│   ├── themes/                # Định nghĩa theme tùy chỉnh cho Material UI
│   ├── types/                 # Các TypeScript interface dùng chung toàn app
│   └── utils/                 # Các hàm tiện ích dùng chung (format, helper...)
│
└── plugin-form-builder/       # Workspace phát triển & build plugin động độc lập
    ├── src/
    │   └── plugins/           # Chứa source code của từng plugin (mỗi plugin là 1 folder)
    │       ├── demo-form/     # Plugin mẫu mặc định
    │       └── ...
    ├── scripts/               # Các script build, watch và publish plugin
    ├── dist/                  # Output file sau khi build (các file .mjs tạm thời)
    └── package.json           # Danh sách các script build của builder
```

---

## 4. Cơ chế hoạt động của Runtime Plugin

> Xem tài liệu chi tiết về kiến trúc, SDK API reference và sequence diagrams tại [runtime_plugin_flow.md](/docs/runtime_plugin_flow.md).

```mermaid
sequenceDiagram
    participant User as Người dùng
    participant Host as Host App (React Router)
    participant Loader as LoadFormRuntime
    participant Manifest as manifest.json
    participant Factory as createGenericRuntime(pluginId)
    participant Module as Plugin Module (.mjs)
    participant Redux as pluginForms slice
    
    User->>Host: Truy cập /user-forms/:plugin-name
    Host->>Loader: Chuyển hướng tới LoadFormRuntime
    Loader->>Manifest: Tải danh sách plugin từ public/plugins/manifest.json
    Manifest-->>Loader: Trả về danh sách plugin
    Loader->>Loader: Tìm đối sánh plugin qua routePath
    Loader->>Factory: Tạo SDK generic (scoped by plugin.id)
    Factory-->>Loader: sdk (form, hooks, store, components, http, broadcast)
    Loader->>Module: Dynamic Import file .mjs tương ứng
    Module-->>Loader: Export createPluginComponent
    Loader->>Module: createPluginComponent({ react: React, sdk })
    Module-->>Loader: PluginComponent
    Loader->>User: Render <PluginComponent />
    
    Note over Module,Redux: Plugin dùng sdk.store.* để persist form state
    Module->>Redux: sdk.store.updatePluginForm(data)
    Note over Redux: pluginForms.forms[pluginId] = data
```

Để một Plugin Module được xem là hợp lệ, nó phải xuất bản (export) theo một trong hai cách:
1. `export default`: Trả về một React Component trực tiếp.
2. `export const createPluginComponent`: Một factory function nhận vào `{ react, sdk }` và trả về một React Component.

**Nguyên tắc quan trọng:**
- Host sử dụng **1 generic runtime duy nhất** (`src/runtime/types/genericRuntime.ts`) cho mọi plugin.
- **Không cần** tạo runtime declaration riêng hay sửa `AppPlugin.tsx` khi thêm plugin mới.
- Plugin truy cập form, hooks, store, components thông qua `sdk` — không import trực tiếp.

---

## 5. Quy tắc và Quy ước kỹ thuật bắt buộc

### 5.1 Quy ước tự động Reset Form (`useFormActions`)
Hệ thống sử dụng custom hook `useFormActions` (`src/hooks/useForm.ts`) để hỗ trợ reset form tự động khi đóng tab dựa vào tên action của Redux, tránh việc phải hard-code. Để cơ chế này hoạt động chính xác, khi tạo mới một Redux Form Slice, bạn phải tuân thủ nghiêm ngặt quy ước sau:

1. **`name` của slice** phải đặt trùng khớp với dạng chữ thường của `IFormKey` tương ứng:
   ```ts
   // Ví dụ với IFormKey.BILL (giá trị là 'BILL')
   name: IFormKey.BILL.toLowerCase() // -> 'bill'
   ```
2. **Reducer dùng để reset** trong slice phải được đặt tên theo quy tắc `reset[Key]Form` (dạng PascalCase đối với phần Key):
   ```ts
   reducers: {
     resetBillForm: (state) => {
       state.formData = initialState.formData;
     }
   }
   ```
Khi đó, lệnh `resetForm(IFormKey.BILL)` sẽ tự động tạo và dispatch action type: `bill/resetBillForm`.

### 5.2 Phát triển Plugin mới
Khi tạo một plugin mới, hãy đảm bảo tuân thủ các bước:
1. **Tạo mã nguồn:** Đặt tại `plugin-form-builder/src/plugins/<tên-plugin>/index.tsx`.
2. **Sử dụng SDK:** Hạn chế import trực tiếp từ các thư viện ngoài. Sử dụng các API được tiêm qua `sdk`:
   - `sdk.components` — UI components (Box, Button, TextField, NumberField, DropDownList, DateField...)
   - `sdk.form` — react-hook-form (useForm, FormProvider, Controller, useFormContext, useWatch)
   - `sdk.hooks` — Custom hooks (useReduxFormSync)
   - `sdk.store` — Redux state scoped (getPluginFormState, updatePluginForm, resetPluginForm)
3. **Build & Publish local:** Chạy các lệnh đóng gói để kiểm tra.
4. **Khai báo Manifest:** Thêm đầy đủ thông tin định tuyến vào `public/plugins/manifest.json`.
5. **Không cần sửa host app:** Generic runtime tự động tạo SDK cho mọi plugin dựa trên `pluginId`.

### 5.3 Giao tiếp chéo tab bằng BroadcastChannel
Hệ thống tích hợp API `BroadcastChannel` cho phép trao đổi dữ liệu chéo tab (ví dụ: tự động đăng xuất các tab khi một tab chọn đăng xuất, đồng bộ theme, v.v.).
1. **Sử dụng Hook `useBroadcastChannel`:**
   - Nếu vừa lắng nghe vừa gửi message: `const { postMessage } = useBroadcastChannel((msg) => { ... })`.
   - Nếu **chỉ gửi message**, không truyền callback: `const { postMessage } = useBroadcastChannel()`. Việc này tránh kích hoạt Event Listener ẩn trên tab hiện tại.
2. **Khai báo Event Types:** Mọi loại sự kiện phải nằm trong `BroadcastEventTypes` thuộc `src/services/utils/broadcast.ts`.
3. **Gọi từ dynamic plugins:** Sử dụng qua SDK thông qua `sdk.broadcast` (`postMessage` và `subscribe`).

---

## 6. Các câu lệnh thông dụng

### Dành cho Host App (Thư mục gốc)
* Cài đặt dependencies:
  ```bash
  yarn install
  ```
* Chạy Dev Server (Vite) tại địa chỉ `http://localhost:2210` (hoặc HTTPS nếu có cert):
  ```bash
  yarn start
  ```
* Kiểm tra lỗi cú pháp (Linting):
  ```bash
  yarn lint
  ```
* Type-check và Build ứng dụng Host chính thức:
  ```bash
  yarn build
  ```

### Dành cho Plugin Builder (`plugin-form-builder/`)
* Đi tới thư mục builder:
  ```bash
  cd plugin-form-builder
  ```
* Biên dịch một plugin cụ thể (mặc định: `demo-form`):
  ```bash
  yarn build [tên-plugin]
  ```
* Tự động biên dịch lại khi file thay đổi:
  ```bash
  yarn watch [tên-plugin]
  ```
* Đẩy file `.mjs` đã biên dịch sang thư mục `public/plugins/` của Host:
  ```bash
  yarn publish:local [tên-plugin]
  ```
* Biên dịch toàn bộ các plugin có trong thư mục `src/plugins/`:
  ```bash
  yarn build:all
  ```

---

## 7. Khắc phục sự cố nhanh (Troubleshooting)

| Lỗi thường gặp | Nguyên nhân phổ biến | Cách khắc phục |
|---|---|---|
| **`Cannot load plugin manifest`** | File `manifest.json` không tồn tại, sai cú pháp JSON hoặc lỗi cổng mạng. | Kiểm tra file tại `public/plugins/manifest.json`. Xem lại biến cấu hình `VITE_PLUGIN_MANIFEST_URL`. |
| **`No plugin found for route...`** | Chưa khai báo plugin trong manifest hoặc trường `routePath` bị sai lệch. | Kiểm tra thuộc tính `routePath` trong manifest xem có khớp với URL đang mở không, đảm bảo `enabled: true`. |
| **`Plugin <id> has no valid exported component`** | Plugin không export đúng chuẩn `default` hoặc `createPluginComponent`. | Kiểm tra file nguồn của plugin. Mở file `.mjs` sau khi build để đảm bảo phần export hợp lệ. |
| **Plugin form state không persist** | Plugin chưa sử dụng `sdk.hooks.useReduxFormSync` hoặc `sdk.store.updatePluginForm`. | Kiểm tra plugin code có gọi `useReduxFormSync` với `onSave` callback đúng cách không. Xem [runtime_plugin_flow.md](/docs/runtime_plugin_flow.md). |

---

## 8. Hướng dẫn dành riêng cho AI Agents & Nhà phát triển mới

Để duy trì chất lượng mã nguồn và tự động hóa các tác vụ phát triển, hệ thống đã trang bị bộ quy tắc và kỹ năng (skills) chuyên biệt:

1. **Bộ Quy tắc Dự án**:
   - Vui lòng xem [project_rules.md](/docs/project_rules.md) để biết các quy ước cụ thể về lập trình Redux, DataTable, chỉnh sửa ô lưới và phát triển Runtime Plugins.
2. **Kỹ năng Phát triển Dự án (Project Development Skill)**:
   - Một bộ skill hướng dẫn từng bước đã được lưu trữ tại [project_development_skill.md](/docs/project_development_skill.md). Các tác nhân AI khi hoạt động trong workspace này nên tham khảo skill này trước khi thực thi viết mã để đảm bảo tuân thủ đúng quy trình.
