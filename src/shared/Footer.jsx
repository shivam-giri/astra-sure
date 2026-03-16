// src/shared/Footer.jsx
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function Footer() {
  const theme = useTheme();
  const bg = theme.palette.mode === "dark" ? "#0b1220" : "#0D47A1";

  return (
    <Box sx={{ py: 4, textAlign: "center", background: bg, color: "white", mt: 6 }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>AstraSure</Typography>
      <Typography sx={{ opacity: 0.85 }}>Empowering smarter insurance choices.</Typography>
      <Typography sx={{ mt: 2, opacity: 0.6, fontSize: "0.8rem" }}>
        © {new Date().getFullYear()} AstraSure. All rights reserved.
      </Typography>
    </Box>
  );
}