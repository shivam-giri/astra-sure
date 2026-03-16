// src/pages/ResetPassword.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, Alert, CircularProgress, useTheme
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { resetPassword } from "../services/auth";

export default function ResetPassword() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  // prefill from URL (?token=...)
  useEffect(() => {
    const t = params.get("token");
    if (t) setToken(t);
  }, [params]);

  const validate = () => {
    if (!token) { setError("Reset token missing. Use the link from your email or paste the token."); return false; }
    if (!pwd || pwd.length < 6) { setError("Password must be at least 6 characters"); return false; }
    if (pwd !== confirm) { setError("Passwords do not match"); return false; }
    setError(""); return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await resetPassword({ token, password: pwd });
      setOk(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 }, px: 2, display: "flex", justifyContent: "center",
        background: isDark ? "linear-gradient(180deg,#0b1220,#0f172a)" : "linear-gradient(180deg,#e3f2fd,#ffffff)",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 520, borderRadius: 3, boxShadow: isDark ? 8 : 3 }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Reset Password</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Create a new password for your account.
          </Typography>

          {ok && <Alert severity="success" sx={{ mb: 2 }}>Password updated. Redirecting…</Alert>}
          {!!error && !ok && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={onSubmit}>
            {/* Show token field in case user opens the page without query param */}
            <TextField
              label="Reset token"
              fullWidth
              margin="normal"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste token from reset email"
            />

            <TextField
              label="New password"
              fullWidth
              margin="normal"
              type={showPwd ? "text" : "password"}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
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
              label="Confirm password"
              fullWidth
              margin="normal"
              type={showPwd ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 2 }} disabled={loading}>
              {loading ? <CircularProgress size={22} /> : "Update Password"}
            </Button>

            <Button component={RouterLink} to="/login" fullWidth sx={{ mt: 2 }}>
              ← Back to Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}