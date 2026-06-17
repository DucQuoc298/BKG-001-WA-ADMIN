// src/types.ts
var definePlugin = (factory) => factory;

// src/plugins/demo-form/index.tsx
var defaultValues = {
  customerName: "",
  email: "",
  phone: "",
  note: ""
};
var createPluginComponent = definePlugin(({ react: React, sdk }) => {
  const { MainCard, ContainerWrapper, Typography, Button, Stack, TextField } = sdk.components;
  const { useForm, FormProvider } = sdk.form;
  const { useReduxFormSync } = sdk.hooks;
  const { useState } = React;
  function DemoFormPlugin() {
    const methods = useForm({ defaultValues });
    const { register, handleSubmit, watch } = methods;
    const formValues = watch();
    const [submitted, setSubmitted] = useState(false);
    const pluginState = sdk.store.getPluginFormState();
    useReduxFormSync({
      methods,
      values: pluginState ? {
        ...pluginState.data,
        dirtyFields: pluginState.dirtyFields
      } : null,
      onSave: (snapshot) => {
        const { dirtyFields, ...data } = snapshot;
        sdk.store.updatePluginForm({ data, dirtyFields });
      }
    });
    const onSubmit = (data) => {
      console.log("[demo-form] Submitted:", data);
      setSubmitted(true);
    };
    const handleReset = () => {
      sdk.store.resetPluginForm();
      methods.reset(defaultValues);
      setSubmitted(false);
    };
    return /* @__PURE__ */ React.createElement(ContainerWrapper, null, /* @__PURE__ */ React.createElement(FormProvider, { ...methods }, /* @__PURE__ */ React.createElement(MainCard, { title: "Demo Form Plugin (react-hook-form + Redux Sync)" }, /* @__PURE__ */ React.createElement(Stack, { spacing: 2 }, /* @__PURE__ */ React.createElement(
      TextField,
      {
        label: "Customer Name",
        ...register("customerName"),
        value: formValues.customerName
      }
    ), /* @__PURE__ */ React.createElement(
      TextField,
      {
        label: "Email",
        ...register("email"),
        value: formValues.email
      }
    ), /* @__PURE__ */ React.createElement(
      TextField,
      {
        label: "Phone",
        ...register("phone"),
        value: formValues.phone
      }
    ), /* @__PURE__ */ React.createElement(
      TextField,
      {
        label: "Note",
        ...register("note"),
        value: formValues.note,
        multiline: true
      }
    ), /* @__PURE__ */ React.createElement(Stack, { direction: "row", spacing: 1 }, /* @__PURE__ */ React.createElement(
      Button,
      {
        text: "Submit",
        onClick: handleSubmit(onSubmit)
      }
    ), /* @__PURE__ */ React.createElement(
      Button,
      {
        text: "Reset",
        onClick: handleReset
      }
    )), submitted && /* @__PURE__ */ React.createElement(Typography, { color: "success.main", variant: "body2" }, "\u2713 Form submitted successfully!")))));
  }
  return DemoFormPlugin;
});
export {
  createPluginComponent
};
