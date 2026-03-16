import { useState } from "react";
import { Button, Container } from "@mui/material";
import WizardStepper from "../components/WizardStepper";
import Banner from "../shared/Banner";

import StepPersonal from "./wizard/StepPersonal";
import StepFamily from "./wizard/StepFamily";
import StepLifestyle from "./wizard/StepLifestyle";
import StepFinancial from "./wizard/StepFinancial";
import StepCoverage from "./wizard/StepCoverage";
import StepSummary from "./wizard/StepSummary";


import { motion } from "framer-motion";
import { pageFade } from "../utils/animations";


import {
  validatePersonal,
  validateFamily,
  validateFinancial,
  validateCoverage
} from "../utils/validation";

import { useWizard } from "../context/WizardContext";

export default function Wizard() {
  const [active, setActive] = useState(0);
  const [errors, setErrors] = useState({});
  const { form } = useWizard();

    const steps = [
    <StepPersonal errors={errors} setErrors={setErrors} />,
    <StepFamily errors={errors} setErrors={setErrors} />,
    <StepLifestyle />, // no validation here
    <StepFinancial errors={errors} setErrors={setErrors} />,
    <StepCoverage errors={errors} setErrors={setErrors} />,
    <StepSummary />
    ];


  const validateStep = () => {
    let e = {};

    if (active === 0) e = validatePersonal(form);
    if (active === 1) e = validateFamily(form);
    if (active === 3) e = validateFinancial(form);
    if (active === 4) e = validateCoverage(form);

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setActive((p) => p + 1);
  };

  return (
    <motion.div {...pageFade}>
        
<Banner
  title="AI Recommender"
  subtitle="Fill in your details and get an AI‑powered policy suggestion."
/>

    <Container maxWidth="md" sx={{ py: 3 }}>
      <WizardStepper active={active} />

      {steps[active]}

      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <Button disabled={active === 0} onClick={() => setActive((p) => p - 1)}>
          Back
        </Button>

        {active < steps.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button variant="contained" color="success">
            Finish
          </Button>
        )}
      </div>
    </Container>
    </motion.div>
  );
}