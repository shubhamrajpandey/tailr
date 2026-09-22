/**
 * High-entropy 6-digit OTP generator using cryptographically secure PRNG.
 */
export function generateNumericOtp(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  // Ensures integer in range [100000, 999999]
  const code = (array[0] % 900000) + 100000;
  return code.toString();
}

/**
 * Validates whether an OTP matches 6-digit numeric pattern.
 */
export function isValidOtpFormat(code: string): boolean {
  return /^[0-9]{6}$/.test(code);
}
