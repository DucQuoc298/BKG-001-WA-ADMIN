import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

type InvoiceCreatePageProps = {
  tabId: string;
  params?: Record<string, any>;
};

export function InvoiceCreatePage({ tabId }: InvoiceCreatePageProps) {
  const [form, setForm] = useState({
    customerCode: "",
    invoiceDate: "",
    note: "",
  });

  const [lines, setLines] = useState<any[]>([]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div>
      <TextField
        label="Customer Code"
        value={form.customerCode}
        onChange={(e) => updateField("customerCode", e.target.value)}
      />

      <TextField
        label="Invoice Date"
        value={form.invoiceDate}
        onChange={(e) => updateField("invoiceDate", e.target.value)}
      />

      <TextField
        label="Note"
        value={form.note}
        onChange={(e) => updateField("note", e.target.value)}
      />

      <DataGrid
        rows={lines}
        columns={[
          { field: "itemCode", headerName: "Item Code", width: 180 },
          { field: "quantity", headerName: "Quantity", width: 120 },
          { field: "price", headerName: "Price", width: 120 },
        ]}
      />

      <Button variant="contained">Save Invoice</Button>
    </div>
  );
}