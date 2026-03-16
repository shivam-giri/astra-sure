import { Card, CardContent } from "@mui/material";
import { useWizard } from "../../context/WizardContext";

export default function StepSummary() {
  const { form } = useWizard();

  return (
    <div>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <h3>Recommendation (AI Placeholder)</h3>
          <p>
            Based on your profile, we recommend a <b>Term Insurance Plan</b> 
            with coverage of <b>₹{form.sumAssured}</b> for {form.coverageTerm} years.
          </p>
          <p>
            Premium estimate: <b>₹{Math.round((form.sumAssured * 0.002) * (form.age > 45 ? 1.3 : 1))}</b> / year.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}