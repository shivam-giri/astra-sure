import { FormControlLabel, Checkbox, Grid } from "@mui/material";
import { useWizard } from "../../context/WizardContext";

export default function StepLifestyle() {
  const { form, updateForm } = useWizard();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControlLabel 
          control={
            <Checkbox 
              checked={form.smoker}
              onChange={(e) => updateForm("smoker", e.target.checked)}
            />
          } 
          label="Are you a smoker?"
        />
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel 
          control={
            <Checkbox 
              checked={form.hasDiseases}
              onChange={(e) => updateForm("hasDiseases", e.target.checked)}
            />
          }
          label="Any existing diseases?"
        />
      </Grid>
    </Grid>
  );
}