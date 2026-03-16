import jwt from 'jsonwebtoken';

const sign = (payload, secret, opts) => jwt.sign(payload, secret, opts);
const verify = (token, secret) => jwt.verify(token, secret);

export const createAccessToken = (userId) =>
  sign({ sub: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_TTL || '15m' });

export const createRefreshToken = (userId) =>
  sign({ sub: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_TTL || '7d' });

export const createResetToken = (userId, resetVersion) =>
  sign({ sub: userId, v: resetVersion }, process.env.JWT_RESET_SECRET, { expiresIn: process.env.RESET_TOKEN_TTL || '1h' });

export const verifyAccessToken = (token) => verify(token, process.env.JWT_ACCESS_SECRET);
export const verifyRefreshToken = (token) => verify(token, process.env.JWT_REFRESH_SECRET);
export const verifyResetToken = (token) => verify(token, process.env.JWT_RESET_SECRET);