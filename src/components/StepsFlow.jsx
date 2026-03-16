// src/components/StepsFlow.jsx
import { Box, Typography, Grid, Card, CardContent, useTheme } from "@mui/material";
import { motion } from "framer-motion";

export default function StepsFlow({
  title = "How It Works",
  steps = []
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box sx={{ py: 8 }}>
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontWeight: 700,
          mb: 5
        }}
      >
        {title}
      </Typography>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Grid container spacing={3}>
          {steps.map((step, idx) => (
            <Grid key={idx} item xs={12} sm={6} md={3}>
              <motion.div variants={itemAnim} style={{ height: "100%" }}>
                <Card
                  sx={{
                    p: 2,
                    textAlign: "center",
                    borderRadius: 4,
                    boxShadow: isDark ? 6 : 3,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.04)"
                      : "#fff",
                    height: "100%",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: isDark ? 10 : 6
                    }
                  }}
                >
                  <CardContent>
                    {/* Step number */}
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        mx: "auto",
                        mb: 2,
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: theme.palette.primary.main,
                        color: "#fff",
                        boxShadow: 3,
                      }}
                    >
                      {idx + 1}
                    </Box>

                    {/* Icon */}
                    <Typography
                      variant="h4"
                      sx={{ mb: 1 }}
                    >
                      {step.icon}
                    </Typography>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {step.title}
                    </Typography>

                    {/* Description */}
                    <Typography color="text.secondary">
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
}