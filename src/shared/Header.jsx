// src/shared/Header.jsx
import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink, Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "../theme";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { toggle, mode } = useColorMode();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  const navItems = useMemo(
    () => [
      { label: "Home", to: "/" },
      { label: "Recommender", to: "/wizard" },
      { label: "Compare", to: "/compare" },
      { label: "Calculator", to: "/calculator" },
      ...(user
        ? [{ label: "Dashboard", to: "/dashboard" }]
        : [{ label: "Login", to: "/login" }]),
    ],
    [user],
  );

  const isPathActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  const linkBaseSx = {
    position: "relative",
    fontWeight: 500,
    textTransform: "none",
    "&:hover": { color: "primary.main" },
    transition: "color .2s ease",
  };

  const activeDecorationSx = {
    "&::after": {
      content: '""',
      position: "absolute",
      left: 8,
      right: 8,
      bottom: -6,
      height: 3,
      borderRadius: 3,
      backgroundColor: isDark ? "#90caf9" : theme.palette.primary.main,
    },
  };

  return (
    <>
      {/* MOBILE DRAWER */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box width={260} p={2}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            AstraSure
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.label}
                component={RouterLink}
                to={item.to}
                selected={isPathActive(item.to)}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </ListItemButton>
            ))}
            <Divider sx={{ my: 1 }} />
            {user && (
              <ListItemButton onClick={handleLogout}>
                Logout ({user.name})
              </ListItemButton>
            )}
            <ListItemButton
              onClick={() => {
                toggle();
                setOpen(false);
              }}
            >
              {mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* HEADER BAR */}
      <Box
        sx={{
          py: 2,
          px: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: isDark
            ? "rgba(15,20,30,0.8)"
            : "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
          position: "sticky",
          top: 0,
          zIndex: 1000,
          transition: "all .25s ease",
        }}
      >
        {/* Logo */}
        <Typography
          variant="h5"
          component={RouterLink}
          to="/"
          sx={{ fontWeight: 700, color: "primary.main", textDecoration: "none" }}
        >
          AstraSure
        </Typography>

        {/* Desktop menu */}
        <Stack
          direction="row"
          spacing={3}
          alignItems="center"
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          {navItems.map((item) => {
            const active = isPathActive(item.to);
            return (
              <Button
                key={item.label}
                component={NavLink}
                to={item.to}
                sx={{
                  ...linkBaseSx,
                  color: active
                    ? isDark
                      ? "#fff"
                      : theme.palette.primary.main
                    : isDark
                      ? "#f5f5f5"
                      : "#333",
                  ...(active ? activeDecorationSx : {}),
                }}
              >
                {item.label}
              </Button>
            );
          })}

          {/* Logout button shown when logged in */}
          {user && (
            <Button
              onClick={handleLogout}
              startIcon={<LogoutIcon fontSize="small" />}
              sx={{ ...linkBaseSx, color: isDark ? "#f5f5f5" : "#333" }}
            >
              Logout
            </Button>
          )}

          <IconButton
            onClick={toggle}
            sx={{ color: isDark ? "#fff" : "#333" }}
            title="Toggle Color Mode"
          >
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Stack>

        {/* Mobile icon */}
        <IconButton
          sx={{
            display: { xs: "block", md: "none" },
            color: isDark ? "#fff" : "#333",
          }}
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </IconButton>
      </Box>
    </>
  );
}
