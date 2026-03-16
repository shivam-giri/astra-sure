import { TextField, Grid } from "@mui/material";
import { useWizard } from "../../context/WizardContext";
import { validateFinancial } from "../../utils/validation";

export default function StepFinancial({ errors = {}, setErrors }) {
  const { form, updateForm } = useWizard();

  const liveValidate = (patch) => {
    const draft = { ...form, ...patch };
    const newErrors = validateFinancial(draft);

    setErrors((prev) => ({
      ...prev,
      liabilities: newErrors.liabilities,
      savings: newErrors.savings
    }));
  };

  return (
    <Grid container spacing={2}>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="Total Liabilities (₹)"
          value={form.liabilities}
          onChange={(e) => {
            updateForm("liabilities", e.target.value);
            liveValidate({ liabilities: e.target.value });
          }}
          error={!!errors.liabilities}
          helperText={errors.liabilities}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="Total Savings (₹)"
          value={form.savings}
          onChange={(e) => {
            updateForm("savings", e.target.value);
            liveValidate({ savings: e.target.value });
          }}
          error={!!errors.savings}
          helperText={errors.savings}
        />
      </Grid>

    </Grid>
  );
}