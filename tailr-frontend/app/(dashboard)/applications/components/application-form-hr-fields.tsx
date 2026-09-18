import * as React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { User, Link2 } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { ApplicationFormValues } from "@/shared/lib/validations/application";

interface ApplicationFormHrFieldsProps {
  register: UseFormRegister<ApplicationFormValues>;
  errors: FieldErrors<ApplicationFormValues>;
}

export function ApplicationFormHrFields({
  register,
  errors,
}: ApplicationFormHrFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* HR Contact Name */}
      <div className="space-y-1.5">
        <label
          htmlFor="hrName"
          className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
        >
          HR / Recruiter Name
        </label>
        <Input
          id="hrName"
          placeholder="e.g. Sarah Jenkins"
          icon={<User className="h-4 w-4" />}
          {...register("hrName")}
        />
        {errors.hrName && (
          <p className="text-xs text-rose-500 font-medium">
            {errors.hrName.message}
          </p>
        )}
      </div>

      {/* HR LinkedIn Profile URL */}
      <div className="space-y-1.5">
        <label
          htmlFor="hrLinkedinUrl"
          className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
        >
          Recruiter LinkedIn URL
        </label>
        <Input
          id="hrLinkedinUrl"
          type="url"
          placeholder="https://linkedin.com/in/recruiter"
          icon={<Link2 className="h-4 w-4" />}
          {...register("hrLinkedinUrl")}
        />
        {errors.hrLinkedinUrl && (
          <p className="text-xs text-rose-500 font-medium">
            {errors.hrLinkedinUrl.message}
          </p>
        )}
      </div>
    </div>
  );
}
