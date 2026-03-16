import express from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import User from '../models/User.js';
import {
  createAccessToken, createRefreshToken, createResetToken,
  verifyAccessToken, verifyRefreshToken, verifyResetToken
} from '../utils/jwt.js';
import { sendResetEmail } from '../utils/email.js';

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

export default router;