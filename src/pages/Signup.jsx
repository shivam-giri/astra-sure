// src/pages/Signup.jsx
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { signup, googleOAuthLogin } from "../services/auth";

export default function Signup() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email || !/^.+@.+\..+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password || form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChange = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (serverError) setServerError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await signup({ name: form.name, email: form.email, password: form.password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setServerError(err?.message || "Sign-up failed. Please try again.");
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
        justifyContent: "center",
        background: isDark
          ? "linear-gradient(180deg,#0b1220,#0f172a)"
          : "linear-gradient(180deg,#e3f2fd,#ffffff)",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 3,
          boxShadow: isDark ? 8 : 3,
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Create Account
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Join AstraSure for smarter insurance decisions.
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Account created successfully! Redirecting to login…
            </Alert>
          )}

          {serverError && !success && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          <Box component="form" onSubmit={onSubmit} noValidate>
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              value={form.name}
              onChange={onChange("name")}
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={form.email}
              onChange={onChange("email")}
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={onChange("password")}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPwd((s) => !s)}>
                      {showPwd ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              type={showPwd ? "text" : "password"}
              value={form.confirm}
              onChange={onChange("confirm")}
              error={!!errors.confirm}
              helperText={errors.confirm}
            />

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              type="submit"
              disabled={submitting || success}
            >
              {submitting ? <CircularProgress size={22} /> : "Create Account"}
            </Button>

            <Button component={RouterLink} to="/login" fullWidth sx={{ mt: 2 }}>
              Already have an account? Login →
            </Button>
          </Box>

          {/* Google OAuth */}
          <Divider sx={{ my: 3 }}>or</Divider>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={googleOAuthLogin}
            startIcon={
              <Box
                component="img"
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                sx={{ width: 20, height: 20 }}
              />
            }
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Sign up with Google
          </Button>

          {/* Phone OTP Login */}
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={() => navigate("/phone-login")}
            sx={{ textTransform: "none", fontWeight: 600, mt: 1 }}
          >
            Sign up with Phone
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}