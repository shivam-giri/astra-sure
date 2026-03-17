// src/pages/OAuthCallback.jsx
// This page handles the redirect from the backend after Google OAuth completes.
// The backend sends: /oauth-callback?token=...&name=...&id=...&email=...
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const name = params.get('name');
    const id = params.get('id');
    const email = params.get('email');

    if (!token || !id) {
      // Something went wrong – bounce to login with error
      navigate('/login?error=google_failed', { replace: true });
      return;
    }

    // Store access token the same way the normal login does
    localStorage.setItem('astra_access_token', token);
    sessionStorage.removeItem('astra_access_token');

    // Update AuthContext so the app knows the user is logged in
    setUser({ id, name, email });

    // Clean token from URL and go to dashboard
    navigate('/', { replace: true });
  }, [navigate, setUser]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress size={48} />
      <Typography color="text.secondary">Signing you in with Google…</Typography>
    </Box>
  );
}
