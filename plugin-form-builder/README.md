# plugin-form-builder

Project TypeScript dùng để build runtime plugin ra các file `.mjs` cho host app.
Mỗi plugin là một form/module độc lập, hoàn toàn tách biệt với host app và các plugin khác.
Plugin nhận mọi công cụ (React, MUI components, react-hook-form, Redux hooks) từ host qua `sdk` tại runtime.

## Cấu trúc

- `src/plugins/<form-name>/index.tsx`: mỗi folder là 1 plugin entry
- `src/components/*`: component dùng chung trong plugin
- `src/types.ts`: type definitions cho PluginSdk, PluginContext
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

## Cách viết plugin

1. Dùng `definePlugin(({ react: React, sdk }) => { ... })`.
2. Lấy `const { react: React, sdk } = context` ở đầu entry.
3. Viết component bằng JSX/TSX như React bình thường.
4. Component con có thể tách ra file riêng trong `src/components`.
5. Để đồng nhất giao diện với host, dùng `sdk.components` (Box, Button, TextField, NumberField, DropDownList, DateField, DateRangeField, Paper, Stack, Typography, MainCard, ContainerWrapper, Dialog).

## SDK API Reference

### `sdk.components` — UI Components
Box, Button, Dialog, MainCard, Paper, Stack, Typography, ContainerWrapper, TextField, NumberField, DropDownList, DateField, DateRangeField.

### `sdk.form` — react-hook-form
```typescript
const { useForm, FormProvider, Controller, useFormContext, useWatch } = sdk.form;
const methods = useForm({ defaultValues: { name: '' } });
```

### `sdk.hooks` — Custom Hooks
```typescript
const { useReduxFormSync } = sdk.hooks;
useReduxFormSync({
  methods,
  values: sdk.store.getPluginFormState(),
  onSave: (snapshot) => {
    const { dirtyFields, ...data } = snapshot;
    sdk.store.updatePluginForm({ data, dirtyFields });
  },
});
```

### `sdk.store` — Redux State (scoped, pluginId đã closure sẵn)
```typescript
sdk.store.getPluginFormState();       // Lấy form state
sdk.store.updatePluginForm(data);     // Cập nhật
sdk.store.resetPluginForm();          // Reset
sdk.store.useSelector(selector);      // Redux useSelector
sdk.store.useDispatch();              // Redux useDispatch
```

### `sdk.http` — HTTP Client
```typescript
const data = await sdk.http.get('/api/customers');
const result = await sdk.http.post('/api/customers', body);
const raw = await sdk.http.fetchJson(url, init);
```

### `sdk.broadcast` — Cross-tab Communication
```typescript
sdk.broadcast.postMessage('EVENT_TYPE', payload);
const unsubscribe = sdk.broadcast.subscribe(callback);
```

## Tạo thêm plugin mới

1. Tạo folder mới: `src/plugins/customer-form/index.tsx`.
2. Chạy `yarn build customer-form` để tạo `dist/customer-form.mjs`.
3. Chạy `yarn publish:local customer-form` để copy sang host.
4. Thêm entry vào `public/plugins/manifest.json`.
5. **Không cần sửa bất kỳ file nào trong host app.**
