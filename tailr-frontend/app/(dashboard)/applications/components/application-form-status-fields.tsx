import * as React from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Calendar, CheckCircle2 } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { ApplicationFormValues } from "@/shared/lib/validations/application";

interface ApplicationFormStatusFieldsProps {
  register: UseFormRegister<ApplicationFormValues>;
  setValue: UseFormSetValue<ApplicationFormValues>;
  watch: UseFormWatch<ApplicationFormValues>;
  errors: FieldErrors<ApplicationFormValues>;
}

export function ApplicationFormStatusFields({
  register,
  setValue,
  watch,
  errors,
}: ApplicationFormStatusFieldsProps) {
  const applied = watch("applied");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        {/* Status Dropdown */}
        <div className="space-y-1.5">
          <label
            htmlFor="status"
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
          >
            Application Status <span className="text-rose-500">*</span>
          </label>
          <Select
            id="status"
            icon={<CheckCircle2 className="h-4 w-4" />}
            {...register("status")}
            onChange={(e) => {
              const newStatus = e.target.value as ApplicationFormValues["status"];
              setValue("status", newStatus);
              if (newStatus !== "WISHLIST") {
                setValue("applied", true);
                if (!watch("appliedDate")) {
                  setValue("appliedDate", new Date().toISOString().split("T")[0]);
                }
              } else {
                setValue("applied", false);
              }
            }}
          >
            <option value="WISHLIST">Wishlist (Planning to apply)</option>
            <option value="APPLIED">Applied (Application submitted)</option>
            <option value="NO_RESPONSE">No Response (Awaiting reply)</option>
            <option value="INTERVIEW">Interview (Interview scheduled)</option>
            <option value="OFFER">Offer (Offer received)</option>
            <option value="REJECTED">Rejected (Not moving forward)</option>
            <option value="GHOSTED">Ghosted (No response)</option>
          </Select>
          {errors.status && (
            <p className="text-xs text-rose-500 font-medium">{errors.status.message}</p>
          )}
        </div>

        {/* Applied Yes/No Switch */}
        <div className="space-y-1.5 pt-0.5">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
            Already Applied?
          </label>
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 min-h-[38px] h-auto gap-2">
            <span className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">
              {applied ? "Yes, application submitted" : "No, still in wishlist"}
            </span>
            <Switch
              checked={applied}
              onCheckedChange={(checked) => {
                setValue("applied", checked);
                if (checked && watch("status") === "WISHLIST") {
                  setValue("status", "APPLIED");
                  setValue("appliedDate", new Date().toISOString().split("T")[0]);
                } else if (!checked) {
                  setValue("status", "WISHLIST");
                  setValue("appliedDate", "");
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Dates Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Position Open Date */}
        <div className="space-y-1.5">
          <label
            htmlFor="positionOpenDate"
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
          >
            Position Open Date
          </label>
          <Input
            id="positionOpenDate"
            type="date"
            icon={<Calendar className="h-4 w-4" />}
            {...register("positionOpenDate")}
          />
          {errors.positionOpenDate && (
            <p className="text-xs text-rose-500 font-medium">{errors.positionOpenDate.message}</p>
          )}
        </div>

        {/* Applied Date */}
        <div className="space-y-1.5">
          <label
            htmlFor="appliedDate"
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
          >
            Applied Date
          </label>
          <Input
            id="appliedDate"
            type="date"
            disabled={!applied}
            icon={<Calendar className="h-4 w-4" />}
            {...register("appliedDate")}
          />
          {errors.appliedDate && (
            <p className="text-xs text-rose-500 font-medium">{errors.appliedDate.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
