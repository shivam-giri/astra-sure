// src/pages/PhoneLogin.jsx
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
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { sendOtp, verifyOtp } from "../services/auth";
import { useAuth } from "../context/AuthContext";

export default function PhoneLogin() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const redirectTo = location.state?.from?.pathname || "/";

  const [step, setStep] = useState(1); // 1 = send number, 2 = verify code
  const [form, setForm] = useState({ phone: "", code: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validatePhone = () => {
    const e = {};
    if (!form.phone.trim()) {
      e.phone = "Phone number is required";
    } else if (!/^\+[1-9]\d{6,14}$/.test(form.phone.trim())) {
      e.phone = "Must be in E.164 format (e.g., +919876543210)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateCode = () => {
    const e = {};
    if (!form.code.trim()) {
      e.code = "Verification code is required";
    } else if (form.code.trim().length !== 6) {
      e.code = "Code must be 6 digits";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChange = (key) => (ev) => {
    setForm((f) => ({ ...f, [key]: ev.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (serverError) setServerError("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validatePhone()) return;

    setSubmitting(true);
    setServerError("");
    try {
      await sendOtp(form.phone.trim());
      setStep(2);
    } catch (err) {
      setServerError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!validateCode()) return;

    setSubmitting(true);
    setServerError("");
    try {
      const data = await verifyOtp({ 
        phone: form.phone.trim(), 
        code: form.code.trim() 
      });
      setUser(data.user);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(err.message || "Verification failed. Incorrect or expired code.");
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
          maxWidth: 450,
          borderRadius: 3,
          boxShadow: isDark ? 8 : 3,
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: "center" }}>
            Phone Login
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
            {step === 1 
              ? "Sign in using your mobile number" 
              : `Enter the 6-digit code sent to ${form.phone}`}
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {serverError}
            </Alert>
          )}

          {step === 1 ? (
            <Box component="form" onSubmit={handleSendOtp} noValidate>
              <TextField
                fullWidth
                label="Phone Number"
                placeholder="+919876543210"
                margin="normal"
                value={form.phone}
                onChange={onChange("phone")}
                error={!!errors.phone}
                helperText={errors.phone || "Include country code (e.g., +91 or +1)"}
              />
              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={22} color="inherit" /> : "Send OTP"}
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleVerifyOtp} noValidate>
              <TextField
                fullWidth
                label="Verification Code"
                placeholder="6-digit code"
                margin="normal"
                value={form.code}
                onChange={onChange("code")}
                error={!!errors.code}
                helperText={errors.code}
                inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem' } }}
              />
              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={22} color="inherit" /> : "Verify & Login"}
              </Button>
              <Button 
                variant="text" 
                fullWidth 
                sx={{ mt: 1 }} 
                onClick={() => setStep(1)}
                disabled={submitting}
              >
                Change Phone Number
              </Button>
            </Box>
          )}

          <Button component={RouterLink} to="/login" fullWidth sx={{ mt: 3 }}>
            Back to Password Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
