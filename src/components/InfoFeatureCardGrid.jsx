// src/components/InfoFeatureCardGrid.jsx
import { Grid, Card, CardContent, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

export default function InfoFeatureCardGrid({
  title,
  items = [],
  columns = { xs: 1, sm: 2, md: 3 }
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ padding: "32px 0" }}>
      {title && (
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            mb: 4,
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Grid container spacing={4}>
          {items.map((item, idx) => (
            <Grid
              key={idx}
              item
              xs={columns.xs}
              sm={columns.sm}
              md={columns.md}
            >
              <MotionCard
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -6 }}
                transition={{ type: "spring", stiffness: 180 }}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  boxShadow: isDark ? 6 : 3,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "#fff",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, mb: 1, fontSize: "1.3rem" }}
                  >
                    {item.icon} {item.title}
                  </Typography>

                  <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </div>
  );
}