# plugin-form-builder

Project TypeScript dùng để build runtime plugin ra các file `.mjs` cho host app.
Muc tieu la de code plugin giong component React thong thuong nhat co the, nhung van dung `React` do host truyen vao luc runtime.

## Cấu trúc

- `src/plugins/<form-name>/index.tsx`: mỗi folder là 1 plugin entry
- `src/components/*`: component dùng chung trong plugin
- `dist/*.mjs`: output sau build

## Lệnh

- `yarn build [form-name]`: build 1 form (mặc định `demo-form`)
- `yarn watch [form-name]`: watch 1 form (mặc định `demo-form`)
- `yarn build:all`: build tất cả form trong `src/plugins/*/index.ts`
- `yarn publish:local [form-name]`: copy `dist/<form-name>.mjs` sang `../public/plugins/<form-name>.mjs`

## Quy trình nhanh

1. Vào thư mục: `cd plugin-form-builder`
2. Cài package: `yarn`
3. Build form demo: `yarn build demo-form`
4. Copy plugin demo sang host: `yarn publish:local demo-form`
5. Refresh route plugin trên host app.

## Kieu viet plugin

1. Dung `definePlugin((context) => { ... })`.
2. Lay `const { react: React, sdk } = context` o dau entry.
3. Viet component bang JSX/TSX nhu React binh thuong.
4. Component con co the tach ra file rieng trong `src/components` va tao bang factory nhan `React`.
5. De dong nhat giao dien voi host, dung `sdk.ui` (Box, Button, Paper, Stack, Typography) thay vi HTML thuong.

## Tạo thêm plugin mới

1. Tạo folder mới, ví dụ: `src/plugins/customer-form/index.tsx`.
2. Chạy `yarn build customer-form` để tạo `dist/customer-form.mjs`.
3. Deploy file mới lên nơi host app đọc plugin manifest.
