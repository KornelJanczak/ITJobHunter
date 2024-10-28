import "dotenv";
export const SESSION_EXPIRY_DATE = 60 * 60000;
export const COOKIE_SESSION_MAX_AGE = 24 * 60 * 60 * 100;
export const SESSION_SECRET = process.env.SESSION_SECRET || "secret";
