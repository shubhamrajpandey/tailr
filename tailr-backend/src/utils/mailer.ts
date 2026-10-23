import { Resend } from "resend";
import { env } from "../config/env";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

// Official Tailr logo hosted on verified Vercel production domain
const TAILR_LOGO_URL = "https://tailr.shubhamrajpandey.com.np/tailr_bg_remove_logo.png";
const TAILR_SUPPORT_EMAIL = "security@tailr.shubhamrajpandey.com.np";

export interface SendOtpEmailParams {
  to: string;
  otp: string;
  fullName?: string;
  expiryMinutes?: number;
}

export interface SendPasswordResetEmailParams {
  to: string;
  otp: string;
  resetLink?: string;
  fullName?: string;
  expiryMinutes?: number;
}

export interface SendPasswordChangedEmailParams {
  to: string;
  fullName?: string;
}

export interface SendWelcomeEmailParams {
  to: string;
  fullName?: string;
}

export interface SendNotificationEmailParams {
  to: string;
  subject: string;
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
  footerNote?: string;
}

export interface DispatchEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Dispatches transactional email using Resend SDK if RESEND_API_KEY is configured.
 * In development without an API key, renders a clean terminal preview.
 * During automated unit tests (NODE_ENV === "test"), bypasses external network calls.
 */
export async function sendEmail({ to, subject, html, text }: DispatchEmailOptions): Promise<boolean> {
  const from = env.EMAIL_FROM || "Tailr Security <noreply@tailr.shubhamrajpandey.com.np>";

  // During automated unit tests, bypass external network calls
  if (env.NODE_ENV === "test") {
    return true;
  }

  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from,
        to: [to],
        subject,
        html,
        text,
      });

      if (error) {
        console.error(`[Resend] Delivery failed to ${to}:`, error.message);
        if (env.NODE_ENV === "production") {
          throw new Error(`Resend API delivery error: ${error.message}`);
        }
        return false;
      }

      console.log(`[Resend] Email delivered to ${to} (id: ${data?.id})`);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[Resend] Transactional delivery error: ${message}`);
      if (env.NODE_ENV === "production") {
        throw new Error(`Failed to deliver email: ${message}`);
      }
      return false;
    }
  }

  // ── Local Development Preview Fallback ──────────────────────────────────────
  console.log("\n" + "=".repeat(62));
  console.log("📨 [TAILR RESEND EMAIL - LOCAL PREVIEW]");
  console.log(`Recipient : <${to}>`);
  console.log(`Subject   : ${subject}`);
  console.log(`Sender    : ${from}`);
  console.log("-".repeat(62));
  console.log(text.trim());
  console.log("=".repeat(62) + "\n");
  return true;
}

/**
 * Clean, modern, minimalist HTML email layout.
 * Avoids loud aggressive colors (no solid green boxes, no harsh red text).
 * Features the official Tailr logo, elegant typography, and subtle neutral cards.
 */
function renderCleanTemplate({
  title,
  preheader,
  bodyHtml,
  footerNote,
}: {
  title: string;
  preheader: string;
  bodyHtml: string;
  footerNote?: string;
}): string {
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#090d16;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#e2e8f0;">
  <div style="display:none;max-height:0px;overflow:hidden;mso-hide:all;">${preheader}</div>
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#090d16;padding:36px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#0f172a;border:1px solid #1e293b;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.4);">
          <!-- Header with Official Tailr Logo -->
          <tr>
            <td style="padding:28px 32px 22px;border-bottom:1px solid #1e293b;text-align:center;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle;padding-right:10px;">
                    <img src="${TAILR_LOGO_URL}" alt="Tailr Logo" width="34" height="34" style="display:block;width:34px;height:34px;border:0;outline:none;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#ffffff;line-height:1;">Tailr</span>
                  </td>
                </tr>
              </table>
              <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#818cf8;margin-top:6px;">AI Career Platform</div>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding:32px;color:#cbd5e1;font-size:15px;line-height:1.65;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Subtle Minimalist Footer -->
          <tr>
            <td style="padding:22px 32px;background-color:#0b1120;border-top:1px solid #1e293b;text-align:center;color:#64748b;font-size:12px;line-height:1.6;">
              <p style="margin:0 0 6px;">${footerNote || "This is an automated notification from Tailr. Please do not reply directly to this email."}</p>
              <p style="margin:0;color:#475569;">© ${currentYear} Tailr. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 1. OTP Email: Clean 6-digit verification code.
 */
export async function sendOtpEmail({
  to,
  otp,
  fullName = "User",
  expiryMinutes = env.OTP_EXPIRY_MINUTES,
}: SendOtpEmailParams): Promise<boolean> {
  const expiryText = `${expiryMinutes} minutes`;
  const subject = `Verify Your Tailr Account: ${otp}`;
  const preheader = `Your 6-digit Tailr verification code is ${otp}. Expires in ${expiryText}.`;

  const bodyHtml = `
    <h1 style="color:#ffffff;font-size:20px;font-weight:700;margin:0 0 16px;letter-spacing:-0.3px;">Verify Your Account</h1>
    <p style="margin:0 0 14px;color:#cbd5e1;">Hi ${fullName},</p>
    <p style="margin:0 0 24px;color:#94a3b8;">Enter the 6-digit verification code below to verify your email and activate your account:</p>
    
    <div style="background-color:#182234;border:1px solid #283548;padding:22px 16px;border-radius:12px;text-align:center;margin:0 0 24px;">
      <div style="font-size:36px;font-weight:800;letter-spacing:8px;color:#ffffff;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;margin-bottom:6px;">${otp}</div>
      <div style="font-size:12px;color:#818cf8;font-weight:500;">Valid for ${expiryText}</div>
    </div>

    <p style="color:#64748b;font-size:13px;margin:0;line-height:1.5;">If you did not request this verification code, you can safely ignore this email.</p>
  `;

  const text = `Hi ${fullName},\n\nYour Tailr verification code is: ${otp}\n\nThis code will expire in ${expiryText}.\nIf you did not request this code, please safely ignore this email.`;

  const html = renderCleanTemplate({
    title: "Verify Your Tailr Account",
    preheader,
    bodyHtml,
    footerNote: "Never share this verification code with anyone. Tailr staff will never ask for your code.",
  });

  return sendEmail({ to, subject, html, text });
}

/**
 * 2. Password Reset Email: Clean reset code + direct action button.
 */
export async function sendPasswordResetEmail({
  to,
  otp,
  resetLink,
  fullName = "User",
  expiryMinutes = 15,
}: SendPasswordResetEmailParams): Promise<boolean> {
  const expiryText = `${expiryMinutes} minutes`;
  const subject = "Reset Your Tailr Password";
  const preheader = `Use code ${otp} to reset your Tailr account password.`;

  const actionButtonHtml = resetLink
    ? `<div style="text-align:center;margin:22px 0 16px;">
        <a href="${resetLink}" style="display:inline-block;background-color:#4f46e5;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;">
          Reset Password
        </a>
       </div>`
    : "";

  const bodyHtml = `
    <h1 style="color:#ffffff;font-size:20px;font-weight:700;margin:0 0 16px;letter-spacing:-0.3px;">Reset Your Password</h1>
    <p style="margin:0 0 14px;color:#cbd5e1;">Hi ${fullName},</p>
    <p style="margin:0 0 20px;color:#94a3b8;">We received a request to reset your Tailr password. Use the verification code below or click the button to set a new password:</p>
    
    <div style="background-color:#182234;border:1px solid #283548;padding:20px 16px;border-radius:12px;text-align:center;margin:0 0 20px;">
      <div style="font-size:34px;font-weight:800;letter-spacing:8px;color:#ffffff;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;margin-bottom:6px;">${otp}</div>
      <div style="font-size:12px;color:#818cf8;font-weight:500;">Valid for ${expiryText}</div>
    </div>

    ${actionButtonHtml}

    <p style="color:#64748b;font-size:13px;margin:16px 0 0;line-height:1.5;">If you did not request a password reset, you can safely ignore this email. Your current password remains secure.</p>
  `;

  const text = `Hi ${fullName},\n\nWe received a request to reset your Tailr password.\n\nYour 6-digit reset code is: ${otp}\n${resetLink ? `Reset link: ${resetLink}\n` : ""}\nThis code expires in ${expiryText}.\nIf you did not request this, you can safely ignore this email.`;

  const html = renderCleanTemplate({
    title: "Reset Your Tailr Password",
    preheader,
    bodyHtml,
    footerNote: "For your security, password reset codes are single-use and expire promptly.",
  });

  return sendEmail({ to, subject, html, text });
}

/**
 * 3. Password Changed Confirmation: Clean security alert without harsh green/red boxes.
 */
export async function sendPasswordChangedEmail({
  to,
  fullName = "User",
}: SendPasswordChangedEmailParams): Promise<boolean> {
  const subject = "Security Notification: Password Changed";
  const preheader = "The password for your Tailr account was successfully changed.";

  const bodyHtml = `
    <h1 style="color:#ffffff;font-size:20px;font-weight:700;margin:0 0 16px;letter-spacing:-0.3px;">Password Successfully Changed</h1>
    <p style="margin:0 0 14px;color:#cbd5e1;">Hi ${fullName},</p>
    
    <div style="background-color:#182234;border:1px solid #283548;border-radius:12px;padding:18px 20px;margin:0 0 20px;color:#e2e8f0;font-size:14px;line-height:1.6;">
      The password for your Tailr account was successfully updated. All other active sessions have been signed out for your protection.
    </div>

    <p style="margin:0 0 12px;color:#94a3b8;font-size:14px;">If you made this change, no further action is required.</p>
    <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;">If you did not make this change, please contact us immediately at <a href="mailto:${TAILR_SUPPORT_EMAIL}" style="color:#818cf8;text-decoration:underline;">${TAILR_SUPPORT_EMAIL}</a> to secure your account.</p>
  `;

  const text = `Hi ${fullName},\n\nYour Tailr account password has been successfully changed.\n\nAll existing sessions have been signed out.\nIf you did not make this change, please contact ${TAILR_SUPPORT_EMAIL} immediately.`;

  const html = renderCleanTemplate({
    title: "Security Notification: Password Changed",
    preheader,
    bodyHtml,
    footerNote: "Tailr Security • Automated Transactional Notification",
  });

  return sendEmail({ to, subject, html, text });
}

/**
 * 4. Welcome Email: Clean onboarding note.
 */
export async function sendWelcomeEmail({
  to,
  fullName = "User",
}: SendWelcomeEmailParams): Promise<boolean> {
  const subject = `Welcome to Tailr, ${fullName}!`;
  const preheader = "Your account is verified. Start crafting targeted resumes and cover letters.";
  const dashboardUrl = `${env.FRONTEND_URL}/dashboard`;

  const bodyHtml = `
    <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 16px;letter-spacing:-0.3px;">Welcome to Tailr</h1>
    <p style="margin:0 0 14px;color:#cbd5e1;">Hi ${fullName},</p>
    <p style="margin:0 0 20px;color:#94a3b8;">Your email has been verified and your account is ready. You can now start tailoring resumes, generating cover letters, and tracking your job applications.</p>
    
    <div style="background-color:#182234;border:1px solid #283548;border-radius:12px;padding:20px;margin:0 0 24px;">
      <div style="font-weight:600;color:#ffffff;margin-bottom:12px;font-size:14px;">Getting started:</div>
      <ul style="margin:0;padding-left:18px;color:#cbd5e1;font-size:14px;line-height:1.8;">
        <li><strong>Tailor Resumes:</strong> Match your resume against any job description.</li>
        <li><strong>Cover Letters:</strong> Create personalized, compelling cover letters.</li>
        <li><strong>Track Applications:</strong> Keep all your active job applications organized.</li>
      </ul>
    </div>

    <div style="text-align:center;margin:24px 0 16px;">
      <a href="${dashboardUrl}" style="display:inline-block;background-color:#4f46e5;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;">
        Go to Dashboard
      </a>
    </div>
  `;

  const text = `Hi ${fullName},\n\nWelcome to Tailr! Your account is verified.\n\nStart tailoring your resumes and cover letters now at: ${dashboardUrl}`;

  const html = renderCleanTemplate({
    title: "Welcome to Tailr",
    preheader,
    bodyHtml,
    footerNote: "Questions or feedback? Reach out to support@tailr.shubhamrajpandey.com.np.",
  });

  return sendEmail({ to, subject, html, text });
}

/**
 * 5. General Notification Email: Flexible template for transactional notifications.
 */
export async function sendNotificationEmail({
  to,
  subject,
  title,
  message,
  actionText,
  actionUrl,
  footerNote,
}: SendNotificationEmailParams): Promise<boolean> {
  const actionButtonHtml =
    actionText && actionUrl
      ? `<div style="text-align:center;margin:22px 0 16px;">
          <a href="${actionUrl}" style="display:inline-block;background-color:#4f46e5;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;">
            ${actionText}
          </a>
         </div>`
      : "";

  const bodyHtml = `
    <h1 style="color:#ffffff;font-size:20px;font-weight:700;margin:0 0 16px;letter-spacing:-0.3px;">${title}</h1>
    <div style="color:#cbd5e1;font-size:15px;line-height:1.65;margin:0 0 20px;">
      ${message}
    </div>
    ${actionButtonHtml}
  `;

  const text = `${title}\n\n${message}\n\n${actionUrl ? `${actionText || "Link"}: ${actionUrl}` : ""}`;

  const html = renderCleanTemplate({
    title,
    preheader: message.slice(0, 100),
    bodyHtml,
    footerNote,
  });

  return sendEmail({ to, subject, html, text });
}
