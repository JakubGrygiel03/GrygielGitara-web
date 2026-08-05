import { randomBytes } from "crypto";

/** Pronounceable-enough temp password for teacher → student handoff. */
export function generateTempPassword(length = 10): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i]! % alphabet.length];
  }
  return out;
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8 && password.length <= 72;
}
