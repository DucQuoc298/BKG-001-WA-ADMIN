# React Template + Runtime Plugin Forms

Template admin app su dung React + Vite + MUI, ho tro runtime plugin forms thong qua file `.mjs` va `public/plugins/manifest.json`.

README nay tong hop cac note can thiet de:
- Chay app local nhanh
- Hieu cau truc project
- Build/publish plugin form
- Them plugin moi dung quy trinh
- Debug cac loi thuong gap

## 1) Tong quan

Project gom 2 phan:

1. Host app (thu muc goc)
- App chinh React/Vite
- Render cac page co san + route runtime plugin
- Doc manifest plugin va dynamic import module `.mjs`

2. Plugin builder (`plugin-form-builder/`)
- Build plugin tu source TS/TSX thanh ESM (`.mjs`)
- Copy output sang `public/plugins/` de host app tai runtime

## 2) Tech stack chinh

- React 19
- Vite 8
- TypeScript
- Material UI
- Redux Toolkit + Redux Saga
- SWR
- Formik + Yup
- i18next
- Esbuild (cho plugin builder)

## 3) Yeu cau moi truong

- Node.js 20+ (khuyen nghi)
- Yarn 4 (duoc khai bao trong `packageManager`)

Ban van co the dung npm, nhung de dong bo lockfile va hanh vi dependency thi nen uu tien Yarn.

## 4) Cai dat va chay nhanh

### Host app

```bash
yarn install
yarn start
```

Mac dinh Vite server chay o:
- `http://localhost:2210`
- Neu co cert trong `./.cert/key.pem` va `./.cert/cert.pem` thi app se chay HTTPS.

### Plugin builder

```bash
cd plugin-form-builder
yarn install
yarn build demo-form
yarn publish:local demo-form
```

Sau do quay lai host app va refresh route plugin de thay thay doi.

## 5) Scripts quan trong

### Host app (`package.json`)

- `yarn start`: chay dev server Vite mode dev
- `yarn build`: type-check + build production vao thu muc `build/`
- `yarn preview`: preview ban build
- `yarn lint`: lint code trong `src/`
- `yarn lint:fix`: lint va auto-fix

### Plugin builder (`plugin-form-builder/package.json`)

- `yarn build [form-name]`: build 1 plugin (mac dinh `demo-form`)
- `yarn watch [form-name]`: watch build 1 plugin
- `yarn publish:local [form-name]`: copy `dist/<form-name>.mjs` -> `../public/plugins/<form-name>.mjs`
- `yarn build:all`: build tat ca plugin trong `src/plugins/*`

## 6) Cau truc thu muc chinh

```text
.
|- src/
|  |- pages/                 # Pages co san cua app
|  |- routes/                # Route config
|  |- runtime/               # Runtime plugin loader/services/types
|  |- components/            # Reusable components
|  |- themes/                # Theme setup
|  |- store/                 # Redux store + saga
|- public/
|  |- plugins/
|     |- manifest.json       # Danh sach plugin runtime
|     |- *.mjs               # Plugin modules da build
|- plugin-form-builder/
|  |- src/plugins/<plugin>/  # Source moi plugin
|  |- scripts/               # Build/publish scripts
|  |- dist/                  # Output `.mjs`
```

## 7) Runtime plugin flow

1. Route `/user-forms/*` duoc map toi runtime loader.
2. Loader fetch `plugins/manifest.json` (hoac URL tu env).
3. Tim plugin theo `routePath`.
4. Resolve `moduleUrl` va dynamic import plugin module.
5. Tao `sdk` theo plugin id (`createAppRuntime(plugin.id)`).
6. Render component plugin.

Plugin module hop le khi export 1 trong 2 kieu:
- `default` la React component
- `createPluginComponent` la factory tra ve React component

## 8) Manifest plugin

File: `public/plugins/manifest.json`

```json
{
	"plugins": [
		{
			"id": "demo-form",
			"name": "Demo Form Plugin",
			"routePath": "/user-forms/demo-form",
			"moduleUrl": "./demo-form.mjs",
			"enabled": true
		}
	]
}
```

Y nghia field:
- `id`: dinh danh plugin, can dong bo voi runtime declaration neu co custom sdk
- `name`: ten hien thi
- `routePath`: duong dan route loader se match
- `moduleUrl`: URL toi file `.mjs`, resolve tu vi tri manifest
- `enabled`: `false` thi plugin bi bo qua

## 9) Cach tao plugin moi

### Buoc 1: Tao source plugin

Tao folder moi:

```text
plugin-form-builder/src/plugins/customer-form/index.tsx
```

Vi du skeleton:

```tsx
import { definePlugin } from '../../types';

export const createPluginComponent = definePlugin(({ sdk }) => {
	const { Box, Typography } = sdk.components;

	function CustomerFormPlugin() {
		return (
			<Box sx={{ p: 3 }}>
				<Typography variant="h5">Customer Form</Typography>
			</Box>
		);
	}

	return CustomerFormPlugin;
});
```

### Buoc 2: Build + publish local

```bash
cd plugin-form-builder
yarn build customer-form
yarn publish:local customer-form
```

### Buoc 3: Dang ky vao manifest

Them item moi vao `public/plugins/manifest.json`:

```json
{
	"id": "customer-form",
	"name": "Customer Form",
	"routePath": "/user-forms/customer-form",
	"moduleUrl": "./customer-form.mjs",
	"enabled": true
}
```

### Buoc 4 (quan trong): Khai bao runtime sdk theo plugin id (neu can)

Host app map `plugin.id` -> sdk runtime trong `src/runtime/AppPlugin.tsx`.

Neu plugin moi can sdk rieng:
- Tao runtime declaration moi trong `src/runtime/types/`
- Import vao `src/runtime/AppPlugin.tsx`
- Them vao `runtimeDeclarations`

Neu khong co declaration theo id, plugin se fallback sang runtime cua `demo-form`.

## 10) Bien moi truong lien quan plugin

- `VITE_PLUGIN_MANIFEST_URL`: override URL manifest plugin.

Neu khong dat bien nay, app dung mac dinh:
- `plugins/manifest.json` theo `window.location.origin + BASE_URL`

## 11) Checklist release plugin

1. Build plugin (`yarn build <name>`)
2. Verify output `plugin-form-builder/dist/<name>.mjs`
3. Copy sang host static (`yarn publish:local <name>` hoac pipeline deploy rieng)
4. Update manifest
5. Neu can, update runtime declaration va map id
6. Chay host app, vao route plugin, test case chinh
7. Chay lint/build truoc merge

## 12) Troubleshooting nhanh

## 12a) Convention reset form khi dong tab

Hook `src/hooks/useForm.ts` dang reset form theo convention action type, khong hard-code tung slice cu the.

Khi tao form slice moi va muon `resetForm(formKey)` tu dong hoat dong, can giu dung 2 quy uoc sau:

- `name` cua slice phai bang `IFormKey.X.toLowerCase()`
- reducer reset phai co ten `resetXForm`

Vi du voi `IFormKey.BILL`:

```ts
const billSlice = createSlice({
	name: IFormKey.BILL.toLowerCase(),
	initialState,
	reducers: {
		resetBillForm: (state) => {
			state.formData = initialState.formData;
		}
	}
});
```

Luc do `resetForm(IFormKey.BILL)` se tu dispatch action type:

```ts
bill/resetBillForm
```

Neu khong dung convention nay, can tu xu ly rieng trong logic reset form.

### Loi: `Cannot load plugin manifest`

- Kiem tra file `public/plugins/manifest.json`
- Kiem tra URL sau khi set `VITE_PLUGIN_MANIFEST_URL`
- Kiem tra network va status code manifest

### Loi: `No plugin found for route ...`

- Kiem tra `routePath` trong manifest co dung URL dang mo
- Kiem tra plugin co `enabled: true`

### Loi: `Plugin <id> has no valid exported component`

- Plugin phai export `default` component hoac `createPluginComponent`
- Kiem tra output `.mjs` co dung noi dung sau build

### Plugin khong dung dung sdk mong muon

- Kiem tra `id` trong manifest
- Kiem tra map trong `src/runtime/AppPlugin.tsx`
- Neu chua map id moi, plugin dang dung fallback runtime (`demo-form`)

## 13) Lenh de kiem tra truoc khi merge

Tai root:

```bash
yarn lint
yarn build
```

Tai plugin builder:

```bash
cd plugin-form-builder
yarn build:all
```

---