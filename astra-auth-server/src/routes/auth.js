import express from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import passport from '../config/passport.js';
import User from '../models/User.js';
import {
  createAccessToken, createRefreshToken, createResetToken,
  verifyAccessToken, verifyRefreshToken, verifyResetToken
} from '../utils/jwt.js';
import { sendResetEmail } from '../utils/email.js';
import { sendOtp, verifyOtp } from '../utils/twilio.js';

const router = express.Router();

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/auth/refresh'
};

// ====== Schemas
const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(6),
  remember: z.boolean().optional()
});

const forgotSchema = z.object({
  email: z.string().email()
});

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6)
});

// ====== Helpers
const publicUser = (u) => ({ id: u._id.toString(), name: u.name, email: u.email });

// ====== POST /auth/signup
router.post('/signup', async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  const { name, email, password } = parsed.data;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  return res.status(201).json({ user: publicUser(user) });
});

// ====== POST /auth/login
router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  const { email, password, remember } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);

  // Long-lived cookie if "remember me" is true (else session cookie)
  const maxAge = remember ? 7 * 24 * 60 * 60 * 1000 : undefined;
  res.cookie('refresh_token', refreshToken, { ...cookieOpts, maxAge });

  return res.json({ accessToken, user: publicUser(user) });
});

// ====== POST /auth/logout
router.post('/logout', async (_req, res) => {
  res.clearCookie('refresh_token', { ...cookieOpts, maxAge: 0 });
  return res.json({ ok: true });
});

// ====== GET /auth/me  (expects Authorization: Bearer <accessToken>)
router.get('/me', async (req, res) => {
  try {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    return res.json({ user: publicUser(user) });
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

// ====== POST /auth/refresh (reads httpOnly cookie)
router.post('/refresh', async (req, res) => {
  try {
    const rt = req.cookies?.refresh_token;
    if (!rt) return res.status(401).json({ message: 'No refresh token' });

    const payload = verifyRefreshToken(rt);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const accessToken = createAccessToken(user._id);
    return res.json({ accessToken, user: publicUser(user) });
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

// ====== POST /auth/forgot
router.post('/forgot', async (req, res) => {
  const parsed = forgotSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  const { email } = parsed.data;
  const user = await User.findOne({ email });
  // Always respond 200 to avoid account enumeration
  if (!user) return res.json({ ok: true });

  const token = createResetToken(user._id, user.resetVersion);
  const resetUrl = `${process.env.CLIENT_ORIGIN}/reset?token=${encodeURIComponent(token)}`;

  await sendResetEmail(email, resetUrl);

  return res.json({ ok: true });
});

// ====== POST /auth/reset
router.post('/reset', async (req, res) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  try {
    const { token, password } = parsed.data;
    const payload = verifyResetToken(token); // { sub, v }
    const user = await User.findById(payload.sub);
    if (!user) return res.status(400).json({ message: 'Invalid reset token' });

    // Invalidate token if version mismatch
    if (user.resetVersion !== payload.v) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetVersion += 1; // bump version: old tokens become invalid
    await user.save();

    return res.json({ ok: true });
  } catch {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }
});

// ====== GET /auth/google — start OAuth flow
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// ====== GET /auth/google/callback — Google redirects here after consent
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_ORIGIN}/login?error=google_failed` }),
  async (req, res) => {
    try {
      const user = req.user;
      const accessToken = createAccessToken(user._id);
      const refreshToken = createRefreshToken(user._id);

      // Set httpOnly refresh cookie (same as regular login)
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Redirect to frontend with access token in query param
      const params = new URLSearchParams({
        token: accessToken,
        name: user.name,
        id: user._id.toString(),
        email: user.email,
      });
      return res.redirect(`${process.env.CLIENT_ORIGIN}/oauth-callback?${params.toString()}`);
    } catch (err) {
      console.error('Google callback error:', err);
      return res.redirect(`${process.env.CLIENT_ORIGIN}/login?error=google_failed`);
    }
  }
);

// ====== Phone OTP helpers
const phoneSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{6,14}$/, 'Phone must be in E.164 format, e.g. +919876543210')
});

const verifyOtpSchema = z.object({
  phone: z.string().min(1),
  code: z.string().length(6)
});

// ====== POST /auth/phone/send-otp
router.post('/phone/send-otp', async (req, res) => {
  const parsed = phoneSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  try {
    await sendOtp(parsed.data.phone);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Twilio sendOtp error:', err.message);
    return res.status(500).json({ message: 'Failed to send OTP. Check Twilio credentials.' });
  }
});

// ====== POST /auth/phone/verify-otp
router.post('/phone/verify-otp', async (req, res) => {
  const parsed = verifyOtpSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  const { phone, code } = parsed.data;

  try {
    const approved = await verifyOtp(phone, code);
    if (!approved) return res.status(400).json({ message: 'Invalid or expired OTP.' });

    // Find-or-create user by phone
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        name: phone, // placeholder name; user can update later
        email: `${phone.replace('+', '')}@phone.astrasure.app`, // synthetic unique email
        phone,
      });
    }

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      accessToken,
      user: { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone }
    });
  } catch (err) {
    console.error('Twilio verifyOtp error:', err.message);
    return res.status(500).json({ message: 'OTP verification failed.' });
  }
});

export default router;