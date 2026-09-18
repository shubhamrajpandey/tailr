import * as React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Building2, Globe, Briefcase } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { ApplicationFormValues } from "@/shared/lib/validations/application";

interface ApplicationFormCompanyFieldsProps {
  register: UseFormRegister<ApplicationFormValues>;
  errors: FieldErrors<ApplicationFormValues>;
}

export function ApplicationFormCompanyFields({
  register,
  errors,
}: ApplicationFormCompanyFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Company Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="companyName"
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
          >
            Company Name <span className="text-rose-500">*</span>
          </label>
          <Input
            id="companyName"
            placeholder="e.g. Stripe, Linear, Vercel"
            icon={<Building2 className="h-4 w-4" />}
            {...register("companyName")}
          />
          {errors.companyName && (
            <p className="text-xs text-rose-500 font-medium">
              {errors.companyName.message}
            </p>
          )}
        </div>

        {/* Company Website */}
        <div className="space-y-1.5">
          <label
            htmlFor="companyWebsite"
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
          >
            Company Website
          </label>
          <Input
            id="companyWebsite"
            type="url"
            placeholder="https://company.com"
            icon={<Globe className="h-4 w-4" />}
            {...register("companyWebsite")}
          />
          {errors.companyWebsite && (
            <p className="text-xs text-rose-500 font-medium">
              {errors.companyWebsite.message}
            </p>
          )}
        </div>
      </div>

      {/* Position Title */}
      <div className="space-y-1.5">
        <label
          htmlFor="positionTitle"
          className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
        >
          Position Title <span className="text-rose-500">*</span>
        </label>
        <Input
          id="positionTitle"
          placeholder="e.g. Senior Frontend Engineer"
          icon={<Briefcase className="h-4 w-4" />}
          {...register("positionTitle")}
        />
        {errors.positionTitle && (
          <p className="text-xs text-rose-500 font-medium">
            {errors.positionTitle.message}
          </p>
        )}
      </div>
    </div>
  );
}
