// src/components/buttons.tsx
var createActionButtonsComponent = (React, mui) => {
  const { Button, Stack } = mui;
  function ActionButtons({ loading, callHostApi, callExternalApi }) {
    return /* @__PURE__ */ React.createElement(Stack, { direction: "row", spacing: 1, sx: { mt: 1.5 } }, /* @__PURE__ */ React.createElement(Button, { onClick: callHostApi, disabled: loading, variant: "contained", size: "small" }, loading ? "Loading..." : "Call host API (getLicenceInfo)"), /* @__PURE__ */ React.createElement(Button, { onClick: callExternalApi, disabled: loading, variant: "outlined", size: "small" }, loading ? "Loading..." : "Call external API"));
  }
  return ActionButtons;
};

// src/types.ts
var definePlugin = (factory) => factory;

// src/plugins/demo-form/index.tsx
var createPluginComponent = definePlugin(({ react: React, sdk }) => {
  const { Box, Button, Dialog, MainCard, Paper, Typography } = sdk.ui;
  const ActionButtons = createActionButtonsComponent(React, sdk.ui);
  function DemoFormPlugin() {
    const [result, setResult] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const callHostApi = async () => {
      setLoading(true);
      try {
        const response = await sdk.homeApi.getLicenceInfo();
        setResult(`Host API ok: ${JSON.stringify(response).slice(0, 300)}`);
      } catch (error) {
        setResult(`Host API error: ${error?.message || String(error)}`);
      } finally {
        setLoading(false);
      }
    };
    const callExternalApi = async () => {
      setLoading(true);
      try {
        const response = await sdk.http.fetchJson("https://jsonplaceholder.typicode.com/todos/1");
        setResult(`External API ok: ${JSON.stringify(response)}`);
      } catch (error) {
        setResult(`External API error: ${error?.message || String(error)}`);
      } finally {
        setLoading(false);
      }
    };
    return /* @__PURE__ */ React.createElement(Paper, { sx: { p: 3, m: 3, borderRadius: 2 }, variant: "outlined" }, /* @__PURE__ */ React.createElement(Typography, { variant: "h5", sx: { mt: 0 } }, "Runtime Plugin Demo (MUI from Host)"), /* @__PURE__ */ React.createElement(Typography, { variant: "body2", color: "text.secondary" }, "Plugin dang dung cac component MUI duoc host truyen vao de giu giao dien dong nhat."), /* @__PURE__ */ React.createElement(
      ActionButtons,
      {
        loading,
        callHostApi,
        callExternalApi
      }
    ), /* @__PURE__ */ React.createElement(MainCard, { title: "Host Custom Components", sx: { mt: 2 } }, /* @__PURE__ */ React.createElement(Typography, { variant: "body2", color: "text.secondary" }, "Day la MainCard va Dialog duoc lay truc tiep tu host qua sdk.ui."), /* @__PURE__ */ React.createElement(Button, { sx: { mt: 1 }, variant: "contained", onClick: () => setOpenDialog(true) }, "Open Host Dialog")), /* @__PURE__ */ React.createElement(
      Box,
      {
        component: "pre",
        sx: {
          mt: 2,
          p: 1.5,
          borderRadius: 1,
          bgcolor: "background.default",
          border: 1,
          borderColor: "divider",
          whiteSpace: "pre-wrap",
          maxHeight: 280,
          overflow: "auto"
        }
      },
      result
    ), /* @__PURE__ */ React.createElement(
      Dialog,
      {
        open: openDialog,
        title: "Dialog from Host",
        onClose: () => setOpenDialog(false),
        action: /* @__PURE__ */ React.createElement(Button, { onClick: () => setOpenDialog(false) }, "Close")
      },
      /* @__PURE__ */ React.createElement(Typography, { variant: "body2" }, "Plugin dang tai su dung component Dialog cua du an chinh.")
    ));
  }
  return DemoFormPlugin;
});
export {
  createPluginComponent
};
