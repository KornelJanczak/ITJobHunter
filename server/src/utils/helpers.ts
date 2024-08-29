import crypto from "crypto";

export function generateSessionKey(): string {
  return crypto.randomBytes(32).toString("hex");
}
