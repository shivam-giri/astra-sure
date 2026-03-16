import { TextField, Grid } from "@mui/material";
import { useWizard } from "../../context/WizardContext";
import { validateFamily } from "../../utils/validation";

export default function StepFamily({ errors = {}, setErrors }) {
  const { form, updateForm } = useWizard();

  const liveValidate = (patch) => {
    const draft = { ...form, ...patch };
    const newErrors = validateFamily(draft);

    setErrors((prev) => ({
      ...prev,
      familyMembers: newErrors.familyMembers
    }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          type="number"
          label="Number of Family Members"
          value={form.familyMembers}
          onChange={(e) => {
            updateForm("familyMembers", e.target.value);
            liveValidate({ familyMembers: e.target.value });
          }}
          error={!!errors.familyMembers}
          helperText={errors.familyMembers}
        />
      </Grid>
    </Grid>
  );
}