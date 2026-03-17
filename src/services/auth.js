// src/services/auth.js
const API = import.meta.env.VITE_API_URL;

function tryParse(jsonText) {
  try { return JSON.parse(jsonText); } catch { return {}; }
}

async function asJson(res) {
  if (!res.ok) {
    const txt = await res.text();
    const body = tryParse(txt);
    const msg = body?.message || res.statusText || 'Request failed';
    throw new Error(msg);
  }
  return res.json();
}

// ---------- Auth primitives ----------
export async function signup({ name, email, password }) {
  const res = await fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email, password })
  });
  return asJson(res);
}

export async function login({ email, password, remember = true }) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // gets httpOnly refresh cookie
    body: JSON.stringify({ email, password, remember })
  });
  const data = await asJson(res);
  // store short‑lived access token; refresh stays in cookie
  const key = 'astra_access_token';
  if (remember) {
    localStorage.setItem(key, data.accessToken);
    sessionStorage.removeItem(key);
  } else {
    sessionStorage.setItem(key, data.accessToken);
    localStorage.removeItem(key);
  }
  return data;
}

export async function logout() {
  localStorage.removeItem('astra_access_token');
  sessionStorage.removeItem('astra_access_token');
  await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
}

export function getAccessToken() {
  return localStorage.getItem('astra_access_token') || sessionStorage.getItem('astra_access_token');
}

// Simple presence check (fast, works offline)
export function isAuthenticated() {
  return Boolean(getAccessToken());
}

export async function refresh() {
  const res = await fetch(`${API}/auth/refresh`, {
    method: 'POST',
    credentials: 'include'
  });
  const data = await asJson(res);
  // refresh returns a NEW access token
  const key = 'astra_access_token';
  const inLS = localStorage.getItem(key) !== null;
  if (inLS) localStorage.setItem(key, data.accessToken);
  else sessionStorage.setItem(key, data.accessToken);
  return data;
}

export async function me() {
  const token = getAccessToken();
  if (!token) throw new Error('No access token');
  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include'
  });
  return asJson(res);
}

export async function forgot(email) {
  const res = await fetch(`${API}/auth/forgot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email })
  });
  return asJson(res);
}

export async function resetPassword({ token, password }) {
  const res = await fetch(`${API}/auth/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ token, password })
  });
  return asJson(res);
}

// ---------- Helper for protected API calls (auto‑refresh once) ----------
export async function api(path, { method = 'GET', headers = {}, body, retry = true } = {}) {
  const token = getAccessToken();
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body,
    credentials: 'include'
  });

  if (res.status === 401 && retry) {
    // try one refresh then retry original request
    await refresh().catch(() => {});
    return api(path, { method, headers, body, retry: false });
  }
  return asJson(res);
}

// ---------- Google OAuth ----------
// Just redirects the browser — the backend handles everything
export function googleOAuthLogin() {
  window.location.href = `${API}/auth/google`;
}

// ---------- Phone OTP Login ----------
export async function sendOtp(phone) {
  const res = await fetch(`${API}/auth/phone/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  return asJson(res);
}

export async function verifyOtp({ phone, code }) {
  const res = await fetch(`${API}/auth/phone/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code })
  });
  const data = await asJson(res);
  
  const key = 'astra_access_token';
  localStorage.setItem(key, data.accessToken);
  sessionStorage.removeItem(key);
  return data;
}