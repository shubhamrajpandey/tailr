"use client";

import * as React from "react";
import {
  Building2,
  Globe,
  MapPin,
  Mail,
  Link2,
  Cpu,
  User,
  Plus,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select } from "@/shared/components/ui/select";
import { toast } from "@/shared/lib/toast";
import { useCreateCompanyMutation } from "@/shared/hooks/use-companies";
import type { Company } from "@/shared/types/company";

interface AddCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCompanyCreated?: (company: Company) => void;
  initialName?: string;
}

const SECTOR_OPTIONS = [
  "Technology & Software",
  "Fintech & Banking",
  "E-Commerce & Retail",
  "Healthcare & HealthTech",
  "EdTech & E-Learning",
  "AI & Data Science",
  "Telecommunications",
  "Digital Agency & Design",
  "Consulting & Services",
  "Other",
];

export function AddCompanyDialog({
  isOpen,
  onClose,
  onCompanyCreated,
  initialName = "",
}: AddCompanyDialogProps) {
  const [name, setName] = React.useState(initialName);
  const [sector, setSector] = React.useState(SECTOR_OPTIONS[0]);
  const [location, setLocation] = React.useState("Kathmandu, Nepal");
  const [websiteUrl, setWebsiteUrl] = React.useState("");
  const [linkedinUrl, setLinkedinUrl] = React.useState("");
  const [techStackInput, setTechStackInput] = React.useState("");
  const [hrName, setHrName] = React.useState("");
  const [hrEmail, setHrEmail] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      if (initialName) {
        setName(initialName);
      }
    }
  }, [isOpen, initialName]);

  const createCompanyMutation = useCreateCompanyMutation();

  const handleReset = React.useCallback(() => {
    setName("");
    setSector(SECTOR_OPTIONS[0]);
    setLocation("Kathmandu, Nepal");
    setWebsiteUrl("");
    setLinkedinUrl("");
    setTechStackInput("");
    setHrName("");
    setHrEmail("");
    setDescription("");
    setError(null);
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleReset();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Company name is required.");
      return;
    }

    if (hrEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hrEmail.trim())) {
      setError("Please enter a valid HR email address or leave it blank.");
      return;
    }

    // Parse comma-separated tech stack
    const parsedTechStack = techStackInput
      .split(/[,،]+/)
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      const created = await createCompanyMutation.mutateAsync({
        name: trimmedName,
        sector: sector.trim(),
        industry: sector.trim(),
        location: location.trim() || "Kathmandu, Nepal",
        websiteUrl: websiteUrl.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        hrName: hrName.trim() || undefined,
        hrEmail: hrEmail.trim() || undefined,
        description: description.trim() || undefined,
        techStack: parsedTechStack.length > 0 ? parsedTechStack : undefined,
      });

      toast.success(
        "Company added successfully!",
        `${created.name} is now listed in the directory.`
      );

      handleReset();
      onClose();
      onCompanyCreated?.(created);
    } catch (err: unknown) {
      console.error("[AddCompanyDialog] Error creating company:", err);
      const message =
        err instanceof Error ? err.message : "Failed to add company. Please check your connection.";
      setError(message);
      toast.error("Could not add company", message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        position="responsive"
        className="w-full sm:max-w-xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden rounded-t-3xl sm:rounded-2xl rounded-b-none sm:rounded-b-2xl border-t sm:border border-neutral-200 dark:border-white/10 shadow-2xl bg-white dark:bg-card"
      >
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0 bg-neutral-50/80 dark:bg-white/[0.03]">
          <div className="w-12 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-white/10 bg-neutral-50/80 dark:bg-white/[0.03] shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Add Company to Directory
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Can&apos;t find an organization? Contribute verified company and HR details for everyone.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium animate-in fade-in">
              {error}
            </div>
          )}

          {/* Company Name & Sector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label
                htmlFor="company-name"
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
              >
                <span>Company Name</span>
                <span className="text-rose-500">*</span>
              </label>
              <Input
                id="company-name"
                placeholder="e.g. Leapfrog Technology"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                icon={<Building2 className="h-4 w-4" />}
                className="text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="company-sector"
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Sector / Industry
              </label>
              <Select
                id="company-sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="text-sm"
              >
                {SECTOR_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-white dark:bg-neutral-900 text-foreground">
                    {opt}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Location & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label
                htmlFor="company-location"
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Location
              </label>
              <Input
                id="company-location"
                placeholder="e.g. Kathmandu, Nepal"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                icon={<MapPin className="h-4 w-4" />}
                className="text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="company-website"
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Website URL
              </label>
              <Input
                id="company-website"
                type="text"
                placeholder="https://company.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                icon={<Globe className="h-4 w-4" />}
                className="text-sm"
              />
            </div>
          </div>

          {/* LinkedIn & Tech Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label
                htmlFor="company-linkedin"
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                LinkedIn Page
              </label>
              <Input
                id="company-linkedin"
                type="text"
                placeholder="https://linkedin.com/company/name"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                icon={<Link2 className="h-4 w-4" />}
                className="text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="company-techstack"
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Tech Stack (comma-separated)
              </label>
              <Input
                id="company-techstack"
                placeholder="React, TypeScript, Go, AWS, Docker"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                icon={<Cpu className="h-4 w-4" />}
                className="text-sm"
              />
            </div>
          </div>

          {/* HR Recruiter Info */}
          <div className="p-3.5 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/60 dark:bg-white/[0.02] space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-indigo-500" />
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-200">
                HR / Recruiter Contact (Optional)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label
                  htmlFor="hr-name"
                  className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400"
                >
                  Contact Person Name
                </label>
                <Input
                  id="hr-name"
                  placeholder="e.g. Jane Doe"
                  value={hrName}
                  onChange={(e) => setHrName(e.target.value)}
                  className="h-8.5 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="hr-email"
                  className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400"
                >
                  Contact Email
                </label>
                <Input
                  id="hr-email"
                  type="email"
                  placeholder="hr@company.com"
                  value={hrEmail}
                  onChange={(e) => setHrEmail(e.target.value)}
                  icon={<Mail className="h-3.5 w-3.5" />}
                  className="h-8.5 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="company-description"
              className="text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Description & Summary (Optional)
            </label>
            <Textarea
              id="company-description"
              placeholder="Brief overview of the company, their primary products, engineering culture, or hiring focus..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs min-h-[75px]"
            />
          </div>

          {/* Footer inside form to trigger submit */}
          <DialogFooter className="pt-2 border-t border-neutral-100 dark:border-white/5 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
              disabled={createCompanyMutation.isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createCompanyMutation.isPending || !name.trim()}
              className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xs"
            >
              {createCompanyMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Company</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
