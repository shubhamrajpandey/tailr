"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import {
  applicationFormSchema,
  ApplicationFormValues,
} from "@/shared/lib/validations/application";
import { ApplicationFormCompanyFields } from "./application-form-company-fields";
import { ApplicationFormStatusFields } from "./application-form-status-fields";
import { ApplicationFormHrFields } from "./application-form-hr-fields";
import { ApplicationFormJdField } from "./application-form-jd-field";

interface ApplicationFormProps {
  initialValues?: Partial<ApplicationFormValues>;
  onSubmit: (values: ApplicationFormValues) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

export function ApplicationForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode = "create",
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      companyName: initialValues?.companyName || "",
      companyWebsite: initialValues?.companyWebsite || "",
      positionTitle: initialValues?.positionTitle || "",
      jobDescriptionRaw: initialValues?.jobDescriptionRaw || "",
      positionOpenDate: initialValues?.positionOpenDate || "",
      appliedDate: initialValues?.appliedDate || "",
      applied: initialValues?.applied ?? false,
      status: initialValues?.status || "WISHLIST",
      hrName: initialValues?.hrName || "",
      hrLinkedinUrl: initialValues?.hrLinkedinUrl || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section 1: Role & Company */}
      <Card>
        <CardHeader>
          <CardTitle>Role & Company Information</CardTitle>
          <CardDescription>
            Specify the company and position details for this application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationFormCompanyFields register={register} errors={errors} />
        </CardContent>
      </Card>

      {/* Section 2: Status & Key Dates */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking & Timeline</CardTitle>
          <CardDescription>
            Set the current pipeline status, submission confirmation, and key dates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationFormStatusFields
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />
        </CardContent>
      </Card>

      {/* Section 3: Recruiter & HR Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Recruiter & HR Contact</CardTitle>
          <CardDescription>
            Record point-of-contact details for networking and interview follow-ups.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationFormHrFields register={register} errors={errors} />
        </CardContent>
      </Card>

      {/* Section 4: Raw Job Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Job Description</span>
            <span className="text-xs font-normal text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              AI Tailoring Input
            </span>
          </CardTitle>
          <CardDescription>
            Used by Gemini to analyze key requirements and optimize your master resume.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationFormJdField
            register={register}
            watch={watch}
            errors={errors}
          />
        </CardContent>
      </Card>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="gap-2 min-w-[140px]"
          >
            <Save className="h-4 w-4" />
            {isSubmitting
              ? "Saving..."
              : mode === "create"
              ? "Create Application"
              : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
