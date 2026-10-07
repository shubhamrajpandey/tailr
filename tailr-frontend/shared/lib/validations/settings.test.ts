import { describe, it, expect } from "vitest";
import { accountProfileSchema, accountPasswordSchema, aiSettingsSchema } from "./settings";

describe("settings validations", () => {
  describe("accountProfileSchema", () => {
    it("accepts valid name and email", () => {
      const res = accountProfileSchema.safeParse({
        name: "Jane Doe",
        email: "jane@example.com",
      });
      expect(res.success).toBe(true);
    });

    it("rejects invalid email address", () => {
      const res = accountProfileSchema.safeParse({
        name: "Jane Doe",
        email: "not-an-email",
      });
      expect(res.success).toBe(false);
    });

    it("rejects empty name", () => {
      const res = accountProfileSchema.safeParse({
        name: "",
        email: "jane@example.com",
      });
      expect(res.success).toBe(false);
    });
  });

  describe("accountPasswordSchema", () => {
    it("validates matching passwords", () => {
      const res = accountPasswordSchema.safeParse({
        currentPassword: "oldpassword123",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });
      expect(res.success).toBe(true);
    });

    it("rejects mismatched passwords", () => {
      const res = accountPasswordSchema.safeParse({
        currentPassword: "oldpassword123",
        newPassword: "newpassword123",
        confirmPassword: "differentPassword123",
      });
      expect(res.success).toBe(false);
    });

    it("enforces minimum 8 character length on new password", () => {
      const res = accountPasswordSchema.safeParse({
        currentPassword: "oldpassword123",
        newPassword: "short",
        confirmPassword: "short",
      });
      expect(res.success).toBe(false);
    });
  });

  describe("aiSettingsSchema", () => {
    it("accepts supported models and settings", () => {
      const res = aiSettingsSchema.safeParse({
        model: "gemini-1.5-flash",
        tailoringAggressiveness: "balanced",
        defaultCoverLetterTone: "formal",
        strictTruthConstraint: true,
      });
      expect(res.success).toBe(true);
    });

    it("rejects invalid AI model name", () => {
      const res = aiSettingsSchema.safeParse({
        model: "unsupported-model",
        tailoringAggressiveness: "balanced",
        defaultCoverLetterTone: "formal",
        strictTruthConstraint: true,
      });
      expect(res.success).toBe(false);
    });
  });
});
