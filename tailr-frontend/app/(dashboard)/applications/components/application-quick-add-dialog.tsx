"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select } from "@/shared/components/ui/select";
import type { ApplicationStatus } from "@/shared/types/application";
import type { ApplicationFormValues } from "@/shared/lib/validations/application";
import { Loader2, Plus, Building2, Briefcase, Globe, User } from "lucide-react";

interface ApplicationQuickAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStatus?: ApplicationStatus;
  onSubmit: (values: ApplicationFormValues) => Promise<unknown>;
}

const STAGE_OPTIONS: Array<{ value: ApplicationStatus; label: string }> = [
  { value: "WISHLIST", label: "Wishlist" },
  { value: "APPLIED", label: "Applied" },
  { value: "INTERVIEW", label: "Interview Stage" },
  { value: "OFFER", label: "Offer Received" },
  { value: "REJECTED", label: "Concluded / Rejected" },
  { value: "GHOSTED", label: "Ghosted" },
];

export function ApplicationQuickAddDialog({
  open,
  onOpenChange,
  defaultStatus = "WISHLIST",
  onSubmit,
}: ApplicationQuickAddDialogProps) {
  const [companyName, setCompanyName] = React.useState("");
  const [positionTitle, setPositionTitle] = React.useState("");
  const [status, setStatus] = React.useState<ApplicationStatus>(defaultStatus);
  const [companyWebsite, setCompanyWebsite] = React.useState("");
  const [hrName, setHrName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Sync default status when dialog opens
  React.useEffect(() => {
    if (open) {
      setStatus(defaultStatus);
      setError(null);
    }
  }, [open, defaultStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setError("Company name is required.");
      return;
    }
    if (!positionTitle.trim()) {
      setError("Position title is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const isApplied = status !== "WISHLIST";
      await onSubmit({
        companyName: companyName.trim(),
        positionTitle: positionTitle.trim(),
        status,
        applied: isApplied,
        appliedDate: isApplied ? new Date().toISOString().split("T")[0] : "",
        companyWebsite: companyWebsite.trim() || "",
        hrName: hrName.trim() || "",
        jobDescriptionRaw:
          notes.trim().length >= 10 ? notes.trim() : "Target position in pipeline board tracking.",
        positionOpenDate: "",
        hrLinkedinUrl: "",
      });

      // Reset form
      setCompanyName("");
      setPositionTitle("");
      setCompanyWebsite("");
      setHrName("");
      setNotes("");
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add application.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <Plus className="h-4 w-4 text-primary" />
            Quick Add Application
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Add a role directly to your pipeline board. You can add more details anytime.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              Company Name <span className="text-rose-500">*</span>
            </label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Stripe, Linear, Vercel"
              required
              autoFocus
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
              Position Title <span className="text-rose-500">*</span>
            </label>
            <Input
              value={positionTitle}
              onChange={(e) => setPositionTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              required
              className="h-9 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Initial Stage</label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="h-9 text-xs"
              >
                {STAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                Company URL
              </label>
              <Input
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                placeholder="https://..."
                type="url"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Recruiter / Contact (Optional)
            </label>
            <Input
              value={hrName}
              onChange={(e) => setHrName(e.target.value)}
              placeholder="e.g. Sarah Miller (Lead Talent Partner)"
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Quick Notes / Job Description Snippet
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Salary range, tech stack, referral details..."
              rows={2}
              className="text-xs resize-none"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add to Board
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
