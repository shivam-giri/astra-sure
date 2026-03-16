// src/pages/ForgotPassword.jsx
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
  useTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { forgot } from "../services/auth";

export default function ForgotPassword() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email || !/^.+@.+\..+$/.test(email)) {
      setError("Enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");
    try {
      await forgot(email);
      setSent(true); // only set on success
    } catch (err) {
      setError(err?.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
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
            Forgot Password
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Enter your registered email to receive reset instructions.
          </Typography>

          {sent && (
            <Alert severity="success" sx={{ mb: 2 }}>
              If that email is registered, a reset link has been sent. Check your inbox.
            </Alert>
          )}

          {error && !sent && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!sent && (
            <Box component="form" onSubmit={onSubmit} noValidate>
              <TextField
                label="Email address"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                error={Boolean(error)}
                helperText={error}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={22} /> : "Send Reset Link"}
              </Button>

              <Button component={RouterLink} to="/login" fullWidth sx={{ mt: 2 }}>
                ← Back to Login
              </Button>
            </Box>
          )}

          {sent && (
            <Button component={RouterLink} to="/login" variant="outlined" fullWidth sx={{ mt: 2 }}>
              ← Back to Login
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}