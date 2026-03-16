// src/pages/Login.jsx
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { login } from "../services/auth";
import { useAuth } from "../context/AuthContext";

function isEmailish(value) {
  return /^.+@.+\..+$/.test(value);
}

export default function Login() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const redirectTo = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.email || !isEmailish(form.email)) e.email = "Enter a valid email";
    if (!form.password || form.password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChange = (key) => (ev) => {
    setForm((f) => ({
      ...f,
      [key]: ev.target.type === "checkbox" ? ev.target.checked : ev.target.value,
    }));
    if (Object.keys(errors).length) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    try {
      setSubmitting(true);
      const data = await login(form);
      setUser(data.user);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(err?.message || "Login failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isDark
          ? "linear-gradient(180deg, #0b1220 0%, #0f172a 100%)"
          : "linear-gradient(180deg, #e3f2fd 0%, #ffffff 100%)",
      }}
    >
      <Card
        elevation={isDark ? 8 : 3}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
          width: "100%",
          maxWidth: 980,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Brand side */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            background: "url('/src/assets/baileys-d-2.png') center/cover no-repeat",
            minHeight: 480,
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(45deg, rgba(0,0,0,.55), rgba(0,0,0,.2))",
            }}
          />
          <Box sx={{ position: "absolute", left: 24, bottom: 24, color: "#fff" }}>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: 1 }}>
              AstraSure
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              AI‑powered insurance guidance.
            </Typography>
          </Box>
        </Box>

        {/* Form side */}
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Sign in to continue
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          <Box component="form" onSubmit={onSubmit} noValidate>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={onChange("email")}
              error={!!errors.email}
              helperText={errors.email}
              autoFocus
            />

            <TextField
              label="Password"
              fullWidth
              margin="normal"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={onChange("password")}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPwd((s) => !s)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPwd ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={<Checkbox checked={form.remember} onChange={onChange("remember")} />}
              label="Remember me"
              sx={{ mt: 1 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={22} color="inherit" /> : "Sign in"}
            </Button>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography
                component={RouterLink}
                to="/forgot"
                sx={{ textDecoration: "none", color: "primary.main" }}
              >
                Forgot password?
              </Typography>
              <Typography
                component={RouterLink}
                to="/signup"
                sx={{ textDecoration: "none", color: "primary.main" }}
              >
                Create account
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}