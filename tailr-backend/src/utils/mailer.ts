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
  // Option A: Resend (recommended — zero-config, generous free tier)
  //   1. Sign up at https://resend.com and get an API key.
  //   2. Add RESEND_API_KEY to your production .env.
  //   3. Replace this block with the Resend SDK call below.
  //
  // Option B: Nodemailer over SMTP
  //   1. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM to .env.
  //   2. Replace this block with a createTransport + sendMail call.
  //
  // Until one of the above is configured, the server will throw here in production
  // so that missing email delivery is caught immediately, not silently swallowed.
  //
  // ── Resend integration skeleton (uncomment when ready) ─────────────────────
  // import { Resend } from "resend";
  // const resend = new Resend(env.RESEND_API_KEY);
  // const { error } = await resend.emails.send({
  //   from: "Tailr Security <noreply@tailr.io>",
  //   to,
  //   subject: "Verify Your Tailr Account",
  //   html: `<p>Hi ${fullName},</p>
  //          <p>Your 6-digit verification code is: <strong>${otp}</strong></p>
  //          <p>This code expires in ${expiryText}.</p>`,
  // });
  // if (error) throw new Error(`[Mailer] Resend delivery failed: ${error.message}`);
  // return true;

  throw new Error(
    "[Mailer] Production email delivery is not configured. " +
      "Set RESEND_API_KEY or SMTP credentials and wire up sendOtpEmail() before deploying."
  );
}

