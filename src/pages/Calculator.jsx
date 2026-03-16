import { motion } from "framer-motion";
import { pageFade, fadeDelay } from "../utils/animations";

import Banner from "../shared/Banner";



export default function Calculator() {
  return (
    <motion.div {...pageFade} style={{ padding: 24 }}>
        
<Banner
  title="Premium Calculator"
  subtitle="Estimate your premium instantly with our smart calculator."
/>

      <motion.h2 {...fadeDelay(0)}>Premium Calculator</motion.h2>

      <motion.p {...fadeDelay(1)} style={{ maxWidth: 600 }}>
        Enter your details to calculate the estimated annual premium.
        (UI coming soon)
      </motion.p>
    </motion.div>
  );
}