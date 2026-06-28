import { SignJWT, jwtVerify } from 'jose';

export const ADMIN_COOKIE_NAME = 'timecapsule_admin_token';

// Fallback is only for local dev. Production will throw if secret is missing.
const getSecret = () => {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_SECRET is not set in production. Please set it in your environment variables.');
    }
    return new TextEncoder().encode('fallback-secret-for-development-only');
  }
  return new TextEncoder().encode(secret);
};

export async function signAdminToken(): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7; // 7 days

  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(getSecret());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.admin === true;
  } catch (error) {
    return false;
  }
}
