import * as React from "react";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { Textarea } from "@/shared/components/ui/textarea";
import { ApplicationFormValues } from "@/shared/lib/validations/application";

interface ApplicationFormJdFieldProps {
  register: UseFormRegister<ApplicationFormValues>;
  watch: UseFormWatch<ApplicationFormValues>;
  errors: FieldErrors<ApplicationFormValues>;
}

export function ApplicationFormJdField({
  register,
  watch,
  errors,
}: ApplicationFormJdFieldProps) {
  const jdText = watch("jobDescriptionRaw") || "";
  const wordCount = jdText.trim() ? jdText.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor="jobDescriptionRaw"
          className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
        >
          Raw Job Description <span className="text-rose-500">*</span>
        </label>
        <span className="text-xs font-mono text-neutral-400">
          {wordCount} words ({jdText.length} chars)
        </span>
      </div>
      <Textarea
        id="jobDescriptionRaw"
        rows={8}
        placeholder="Paste the full job posting description here. Gemini will use this to tailor your master resume without hallucinations..."
        className="font-mono text-xs leading-relaxed min-h-[160px]"
        {...register("jobDescriptionRaw")}
      />
      {errors.jobDescriptionRaw ? (
        <p className="text-xs text-rose-500 font-medium">
          {errors.jobDescriptionRaw.message}
        </p>
      ) : (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Tip: Paste the complete responsibilities and qualification requirements for the highest resume match score.
        </p>
      )}
    </div>
  );
}
