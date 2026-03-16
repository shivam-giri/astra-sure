// src/pages/Home.jsx
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  IconButton,
  Drawer,
  List,
  ListItemButton
} from "@mui/material";
import StepsFlow from "../components/StepsFlow";
import Banner from "../shared/Banner";

import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import heroImg from "../assets/hero-insurance.svg";
import { useState } from "react";
import SignpostCarousel from "../components/SignpostCarousel";

export default function Home() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Recommender", to: "/wizard" },
    { label: "Compare", to: "/compare" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "Calculator", to: "/calculator" },
  ];

  
  const slides = [
    {
      image: "/src/assets/rest-of-the-world.jpg",
      sections: [
        {
          kicker: "DEVELOPMENT",
          title: "Development",
          description:
            "New construction and adaptive reuse projects with end‑to‑end delivery for better livability.",
          href: "#",
        },
        {
          kicker: "ACQUISITIONS",
          title: "Acquisitions",
          description:
            "Identify undervalued assets and unlock value through renovation and better operations.",
          href: "#",
        },
        {
          kicker: "PROPERTY MANAGEMENT",
          title: "Property Management",
          description:
            "Resident-first operations that elevate experiences and retention while reducing turnover.",
          href: "#",
        },
      ],
    },
    {
      image: "/src/assets/baileys-d-2.png",
      sections: [
        {
          kicker: "LEASING",
          title: "Leasing",
          description: "Marketing, tours and leases with data‑backed funnels.",
          href: "#",
        },
        {
          kicker: "RENOVATIONS",
          title: "Renovations",
          description: "Unit upgrades and amenity improvements at scale.",
          href: "#",
        },
        {
          kicker: "SUSTAINABILITY",
          title: "Sustainability",
          description: "Efficiency and green certifications for NOI lift.",
          href: "#",
        },
      ],
    },
        {
      image: "/src/assets/baileys-d-2.png",
      sections: [
        {
          kicker: "LEASING",
          title: "Leasing",
          description: "Marketing, tours and leases with data‑backed funnels.",
          href: "#",
        },
        {
          kicker: "RENOVATIONS",
          title: "Renovations",
          description: "Unit upgrades and amenity improvements at scale.",
          href: "#",
        },
        {
          kicker: "SUSTAINABILITY",
          title: "Sustainability",
          description: "Efficiency and green certifications for NOI lift.",
          href: "#",
        },
      ],
    },
  ];


  return (
    <Box>
        
    <Banner
    title="Smarter Insurance Decisions Powered by AI"
    subtitle="Personalised policy guidance, risk scoring & premium prediction."
    showActions={true}
    image={heroImg}
    />

      {/* =========================
          FEATURE CARDS WITH ANIMATION
      ========================== */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 4 }}>
          Why AstraSure?
        </Typography>

        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          {[
            { icon: "🎯", title: "AI‑Driven Insights", desc: "Get tailored insurance recommendations instantly." },
            { icon: "📊", title: "Risk Dashboard", desc: "Understand your risk & coverage in one glance." },
            { icon: "💡", title: "Smart Comparison", desc: "Choose policies based on intelligent matching." },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{ type: "spring", stiffness: 200 }}
              style={{ flex: 1 }}
            >
              <Card sx={{ p: 2, borderRadius: 4, boxShadow: 4 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    {item.icon} {item.title}
                  </Typography>
                  <Typography color="text.secondary">{item.desc}</Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Stack>
        
      <StepsFlow
        title="How AstraSure Recommender Works"
        steps={[
          {
            icon: "📝",
            title: "Enter Your Details",
            description: "Fill personal, family, lifestyle and financial information."
          },
          {
            icon: "🤖",
            title: "AI Analyzes Profile",
            description: "Our engine evaluates your risk and coverage need."
          },
          {
            icon: "📊",
            title: "Compare Best‑Fit Policies",
            description: "Instantly view top policies matched for your profile."
          },
          {
            icon: "🎯",
            title: "Get Final Recommendations",
            description: "AI suggests the best protection & premium options."
          }
        ]}
      />

      </Container>

      {/* Signpost Carousel section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <SignpostCarousel slides={slides} />
      </Container>

    </Box>
  );
}