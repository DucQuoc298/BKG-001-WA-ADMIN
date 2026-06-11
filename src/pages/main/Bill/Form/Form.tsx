import { Grid } from "@mui/system";
import { Button, MainCard, TextField } from "components";
import { useBill } from "hooks/useBill";
import { EFormMode } from "types";
import { styles as defaultStyles } from "themes/config"


const BillForm = () => {
  const { billForm, update, openForm } = useBill()
  return (
    <MainCard>
      <Button text="Back" onClick={() => { openForm(EFormMode.LIST) }} />

      <Grid container {...defaultStyles.grid.container}>
        <Grid {...defaultStyles.grid.gridItem2Columns}>
          <TextField
            id="customerName"
            label="Customer Name"
            value={billForm.customerName}
            onChange={(e) => update({ customerName: e.target.value })}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid {...defaultStyles.grid.gridItem10Columns}>
          <TextField
            id="product"
            label="Product"
            value={billForm.product}
            onChange={(e) => update({ product: e.target.value })}
            fullWidth
            size="small"
          />
        </Grid>
      </Grid>
    </MainCard>
  )

}
export default BillForm;