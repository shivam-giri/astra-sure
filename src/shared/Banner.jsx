// src/shared/Banner.jsx
import { Box, Container, Typography, Stack, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

export default function Banner({ title, subtitle, showActions = false, image }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const gradient = isDark
    ? "linear-gradient(135deg, #0b1220 0%, #101a2e 40%, #15243c 100%)"
    : "linear-gradient(135deg, #1976D2 0%, #42A5F5 40%, #90CAF9 100%)";

  return (
    <Box
      sx={{
        py: 8, px: 2,
        background: gradient,
        color: "white",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ display: "flex", alignItems: "center", flexDirection: { xs: "column", md: "row" } }}
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          style={{ flex: 1 }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            {title}
          </Typography>

          {subtitle && (
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
              {subtitle}
            </Typography>
          )}

          {showActions && (
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Button
                variant="contained"
                component={RouterLink}
                to="/wizard"
                sx={{ background: "white", color: "#1976D2", px: 4, py: 1.5, fontWeight: 700,
                      "&:hover": { background: "#E3F2FD" } }}
              >
                Start Recommender
              </Button>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/compare"
                sx={{ color: "white", borderColor: "white", px: 4, py: 1.5, fontWeight: 700,
                      "&:hover": { background: "rgba(255,255,255,0.2)" } }}
              >
                Compare Policies
              </Button>
            </Stack>
          )}
        </motion.div>

        {image && (
          <motion.img
            src={image}
            alt="Banner"
            style={{ width: "100%", maxWidth: 420, marginTop: 40 }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
          />
        )}
      </Container>
    </Box>
  );
}