/**
 * Cryptographic utility functions for secure hashing and token generation.
 */

/**
 * Computes a SHA-256 hash of the input string using Bun's native crypto.
 * Used for storing OTP hashes and token fingerprints in the database.
 */
export function hashToken(token: string): string {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(token);
  return hasher.digest("hex");
}

/**
 * Generates a cryptographically secure random opaque token (e.g., for refresh tokens).
 */
export function generateSecureRandomToken(byteLength = 32): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString("base64url");
}
