import { TextField, Grid } from "@mui/material";
import { useWizard } from "../../context/WizardContext";
import { validatePersonal } from "../../utils/validation";

export default function StepPersonal({ errors = {}, setErrors }) {
  const { form, updateForm } = useWizard();

  const liveValidate = (patch) => {
    if (!setErrors) return;
    const draft = { ...form, ...patch };
    const newErrors = validatePersonal(draft);

    setErrors(prev => ({
      ...prev,
      name: newErrors.name,
      age: newErrors.age,
      city: newErrors.city,
      income: newErrors.income
    }));
  };

  return (
    <Grid container spacing={2}>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Full Name"
          value={form.name}
          onChange={(e) => {
            updateForm("name", e.target.value);
            liveValidate({ name: e.target.value });
          }}
          error={!!errors.name}
          helperText={errors.name}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          type="number"
          label="Age"
          value={form.age}
          onChange={(e) => {
            updateForm("age", e.target.value);
            liveValidate({ age: e.target.value });
          }}
          error={!!errors.age}
          helperText={errors.age}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="City"
          value={form.city}
          onChange={(e) => {
            updateForm("city", e.target.value);
            liveValidate({ city: e.target.value });
          }}
          error={!!errors.city}
          helperText={errors.city}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          type="number"
          label="Annual Income (₹)"
          value={form.income}
          onChange={(e) => {
            updateForm("income", e.target.value);
            liveValidate({ income: e.target.value });
          }}
          error={!!errors.income}
          helperText={errors.income}
        />
      </Grid>

    </Grid>
  );
}