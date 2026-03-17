import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from './src/config/passport.js';
import authRoutes from './src/routes/auth.js';

const app = express();

const ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: ORIGIN,
    credentials: true, // allow cookies
  })
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Session is only needed for the OAuth redirect round-trip (not for JWT requests)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change_me_in_prod',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', sameSite: 'lax' },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Basic rate limit (tune in prod)
app.use('/auth/', rateLimit({ windowMs: 60_000, max: 60 }));

app.get('/health', (_, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const port = process.env.PORT || 4001;
  app.listen(port, () => {
    console.log(`Auth server running on http://localhost:${port}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});