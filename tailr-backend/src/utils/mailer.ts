import { env } from "../config/env";

export interface SendOtpEmailParams {
  to: string;
  otp: string;
  fullName?: string;
  expiryMinutes?: number;
}

/**
 * OTP email dispatcher.
 *
 * Development: prints OTP to the terminal console for easy local testing.
 * Production:  sends via a real transactional provider (Resend / Nodemailer / AWS SES).
 *              Set RESEND_API_KEY (or SMTP_HOST + SMTP_USER + SMTP_PASS) in your .env
 *              to enable production delivery. The server will refuse to start if neither
 *              is configured in production mode.
 */
export async function sendOtpEmail({
  to,
  otp,
  fullName = "User",
  expiryMinutes = env.OTP_EXPIRY_MINUTES,
}: SendOtpEmailParams): Promise<boolean> {
  const expiryText = `${expiryMinutes} minutes`;

  // ── Development / Local Test Mode ──────────────────────────────────────────
  if (env.NODE_ENV !== "production") {
    console.log("\n" + "=".repeat(62));
    console.log("📨 [TAILR AUTH MAILER - DEVELOPMENT PREVIEW]");
    console.log(`Recipient : ${fullName} <${to}>`);
    console.log(`Subject   : Verify Your Tailr Account`);
    console.log(`Expires In: ${expiryText}`);
    console.log("-".repeat(62));
    console.log(`🔑 YOUR 6-DIGIT VERIFICATION CODE:  \x1b[1m\x1b[36m${otp}\x1b[0m`);
    console.log("=".repeat(62) + "\n");
    return true;
  }

  // ── Production Mode ─────────────────────────────────────────────────────────
  if (env.RESEND_API_KEY) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.EMAIL_FROM || "Tailr Security <noreply@tailr.io>",
          to,
          subject: "Verify Your Tailr Account",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1e293b;">
              <h2 style="color: #0f172a; margin-bottom: 16px;">Verify Your Tailr Account</h2>
              <p>Hi ${fullName},</p>
              <p>Your 6-digit verification code is:</p>
              <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #0284c7;">${otp}</span>
              </div>
              <p style="color: #64748b; font-size: 14px;">This code will expire in ${expiryText}. If you did not request this verification, please safely ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">Tailr AI Career Platform</p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Resend API returned HTTP ${response.status}: ${errorBody}`);
      }

      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[Mailer] Transactional delivery error: ${message}`);
      throw new Error(`Failed to send verification email: ${message}`);
    }
  }

  throw new Error(
    "[Mailer] Production email delivery is not configured. " +
      "Set RESEND_API_KEY and wire up production environment credentials."
  );
}

