// src/layouts/MainLayout.jsx
import { Box } from "@mui/material";
import Header from "../shared/Header";
import Footer from "../shared/Footer";

export default function MainLayout({ children }) {
  return (
    <Box>
      <Header />

      {/* Page-specific banner or content will appear here */}
      <Box sx={{ minHeight: "70vh" }}>
        {children}
      </Box>

      <Footer />
    </Box>
  );
}