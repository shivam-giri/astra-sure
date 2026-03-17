import twilio from 'twilio';

const getClient = () => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new Error('Twilio credentials are not configured in .env');
  }
  return twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
};

/**
 * Send a one-time passcode to the given E.164 phone number via SMS.
 * e.g. sendOtp('+919876543210')
 */
export async function sendOtp(phone) {
  const client = getClient();
  const verification = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SID)
    .verifications.create({ to: phone, channel: 'sms' });
  return verification.status; // 'pending'
}

/**
 * Check the OTP code entered by the user.
 * Returns true if the code is correct, false otherwise.
 */
export async function verifyOtp(phone, code) {
  const client = getClient();
  const check = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SID)
    .verificationChecks.create({ to: phone, code });
  return check.status === 'approved';
}
