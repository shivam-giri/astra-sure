import { Stepper, Step, StepLabel } from "@mui/material";

const steps = [
  "Personal Info",
  "Family",
  "Lifestyle",
  "Financials",
  "Coverage",
  "Summary"
];

export default function WizardStepper({ active }) {
  return (
    <Stepper activeStep={active} alternativeLabel sx={{ mb: 4 }}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}