// src/pages/wizard/StepCoverage.jsx
import { TextField, Grid, Chip, Typography, Stack } from "@mui/material";
import { useWizard } from "../../context/WizardContext";
import { validateCoverage } from "../../utils/validation";

/**
 * Step 5 — Coverage (LIVE VALIDATION)
 * Props:
 *   errors?: { sumAssured?: string; coverageTerm?: string; }
 *   setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>
 */
export default function StepCoverage({ errors = {}, setErrors }) {
  const { form, updateForm } = useWizard();

  // Validate only coverage-related fields on each change
  const liveValidate = (patch) => {
    if (!setErrors) return; // safety: if not passed, skip
    const draft = { ...form, ...patch };
    const coverageErrors = validateCoverage(draft);

    // Only update keys relevant to this step so you don't clobber other step errors
    setErrors((prev) => ({
      ...prev,
      sumAssured: coverageErrors.sumAssured,
      coverageTerm: coverageErrors.coverageTerm
    }));
  };

  const handleSumAssuredChange = (e) => {
    const value = e.target.value; // keep as string; validation will coerce for comparisons
    updateForm("sumAssured", value);
    liveValidate({ sumAssured: value });
  };

  const handleCoverageTermChange = (e) => {
    const value = e.target.value;
    updateForm("coverageTerm", value);
    liveValidate({ coverageTerm: value });
  };

  const toggleRider = (name) => {
    const exists = form.riders.includes(name);
    const next = exists
      ? form.riders.filter((x) => x !== name)
      : [...form.riders, name];
    updateForm("riders", next);
    // no validation needed for riders in current rules
  };

  return (
    <Grid container spacing={2}>
      {/* Sum Assured */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Desired Sum Assured (₹)"
          type="number"
          inputProps={{ min: 0, step: 10000 }}
          value={form.sumAssured}
          onChange={handleSumAssuredChange}
          error={!!errors.sumAssured}
          helperText={errors.sumAssured || "Enter the coverage amount you expect."}
        />
      </Grid>

      {/* Policy Term */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Policy Term (Years)"
          type="number"
          inputProps={{ min: 1, step: 1 }}
          value={form.coverageTerm}
          onChange={handleCoverageTermChange}
          error={!!errors.coverageTerm}
          helperText={errors.coverageTerm || "Minimum 5 years is recommended."}
        />
      </Grid>

      {/* Riders */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Select Riders (optional)
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {["Critical Illness", "Accident Cover", "Hospital Cash"].map((r) => {
            const selected = form.riders.includes(r);
            return (
              <Chip
                key={r}
                label={r}
                onClick={() => toggleRider(r)}
                sx={{
                  mb: 1,
                  bgcolor: selected ? "primary.main" : undefined,
                  color: selected ? "primary.contrastText" : undefined
                }}
                variant={selected ? "filled" : "outlined"}
                clickable
              />
            );
          })}
        </Stack>
      </Grid>

      {/* Guidance */}
      <Grid item xs={12}>
        <Typography variant="caption" color="text.secondary">
          Tip: For primary earners, a common heuristic is **10–15× annual income** as
          term coverage. Choose a term that spans major liabilities (e.g., home loan).
        </Typography>
      </Grid>
    </Grid>
  );
}