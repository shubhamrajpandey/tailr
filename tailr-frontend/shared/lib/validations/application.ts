import { z } from "zod";

export const applicationStatusEnum = z.enum([
  "WISHLIST",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "GHOSTED",
]);

export const applicationFormSchema = z.object({
  companyName: z
    .string()
    .min(1, { message: "Company name is required" })
    .max(100, { message: "Company name is too long" }),
  companyWebsite: z
    .string()
    .trim()
    .refine((val) => !val || /^https?:\/\/.+/i.test(val), {
      message: "Must be a valid URL starting with http:// or https://",
    })
    .optional()
    .or(z.literal("")),
  positionTitle: z
    .string()
    .min(1, { message: "Position title is required" })
    .max(100, { message: "Position title is too long" }),
  jobDescriptionRaw: z
    .string()
    .min(10, { message: "Job description must be at least 10 characters" }),
  positionOpenDate: z.string().optional().or(z.literal("")),
  appliedDate: z.string().optional().or(z.literal("")),
  applied: z.boolean(),
  status: applicationStatusEnum,
  hrName: z.string().max(80).optional().or(z.literal("")),
  hrLinkedinUrl: z
    .string()
    .trim()
    .refine((val) => !val || /^https?:\/\/.+/i.test(val), {
      message: "Must be a valid URL starting with http:// or https://",
    })
    .optional()
    .or(z.literal("")),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;
