// src/types.ts
var definePlugin = (factory) => factory;

// src/plugins/invoice/index.tsx
var createPluginComponent = definePlugin(({ react: React, sdk }) => {
  const { MainCard, ContainerWrapper, Typography } = sdk.components;
  function InvoicePlugin() {
    return /* @__PURE__ */ React.createElement(ContainerWrapper, null, /* @__PURE__ */ React.createElement(MainCard, null, /* @__PURE__ */ React.createElement(Typography, { variant: "h4", gutterBottom: true }, "Invoice Page"), /* @__PURE__ */ React.createElement(Typography, { variant: "body1" }, "This is the invoice page content.")));
  }
  return InvoicePlugin;
});
export {
  createPluginComponent
};
