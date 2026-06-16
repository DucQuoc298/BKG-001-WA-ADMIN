// src/types.ts
var definePlugin = (factory) => factory;

// src/plugins/demo-form/index.tsx
var createPluginComponent = definePlugin(({ react: React, sdk }) => {
  const { MainCard, Paper, Typography } = sdk.components;
  function DemoFormPlugin() {
    return /* @__PURE__ */ React.createElement(Paper, { sx: { p: 3, m: 3, borderRadius: 2 }, variant: "outlined" }, /* @__PURE__ */ React.createElement(Typography, { variant: "h5", sx: { mt: 0 } }, "Runtime Plugin Demo (MUI from Host)"), /* @__PURE__ */ React.createElement(Typography, { variant: "body2", color: "text.secondary" }, "Plugin dang dung cac component MUI duoc host truyen vao de giu giao dien dong nhat."), /* @__PURE__ */ React.createElement(MainCard, { title: "Host Custom Components", sx: { mt: 2 } }, /* @__PURE__ */ React.createElement(Typography, { variant: "body2", color: "text.secondary" }, "Day la MainCard va Dialog duoc lay truc tiep tu host qua sdk.ui.")));
  }
  return DemoFormPlugin;
});
export {
  createPluginComponent
};
