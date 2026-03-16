import { motion } from "framer-motion";
import { pageFade, fadeDelay } from "../utils/animations";
import Banner from "../shared/Banner";
import InfoFeatureCardGrid from "../components/InfoFeatureCardGrid";

export default function Dashboard() {
  return (
    <motion.div {...pageFade} style={{ padding: 24 }}>
        
<Banner
  title="Your Risk Dashboard"
  subtitle="Visualize coverage gaps, risk factors, and financial security."
/>

      <motion.h2 {...fadeDelay(0)}>Risk Dashboard</motion.h2>

      <motion.p {...fadeDelay(1)} style={{ maxWidth: 600 }}>
        Visualize your risk score, coverage gap and protection index.
        (Charts coming soon)
      </motion.p>


<InfoFeatureCardGrid
        title="Your Insurance Insights"
        items={[
          {
            icon: "📊",
            title: "Coverage Gap",
            description:
              "Analyze how much your current coverage falls short based on income and dependents."
          },
          {
            icon: "🧮",
            title: "Premium Planner",
            description:
              "Predict future premium spikes and payment load based on your selections."
          },
          {
            icon: "🛡️",
            title: "Risk Assessment",
            description:
              "Get an AI‑assessed risk score with lifestyle, age, and habit factors."
          },
        ]}
      />



    </motion.div>
  );
}