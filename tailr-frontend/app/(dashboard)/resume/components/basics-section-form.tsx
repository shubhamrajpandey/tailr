"use client";

import * as React from "react";
import { User, Mail, Phone, MapPin, Globe, Code2, Link2 } from "lucide-react";
import { ResumeBasics } from "@/shared/types/resume";
import { Input } from "@/shared/components/ui/input";

interface BasicsSectionFormProps {
  basics: ResumeBasics;
  onChange: (updated: ResumeBasics) => void;
}

export function BasicsSectionForm({ basics, onChange }: BasicsSectionFormProps) {
  const handleChange = (field: keyof ResumeBasics, value: string) => {
    onChange({
      ...basics,
      [field]: value,
    });
  };

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111216]/90 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-200 dark:border-white/[0.06]">
        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <User className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-neutral-950 dark:text-white">
            Personal Information & Links
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Contact information and public profiles used across all tailored versions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div>
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            Full Name *
          </label>
          <Input
            value={basics.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. Shubham Raj Pandey"
            icon={<User className="h-4 w-4 text-neutral-400" />}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            Email Address *
          </label>
          <Input
            type="email"
            value={basics.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="e.g. shubham@example.com"
            icon={<Mail className="h-4 w-4 text-neutral-400" />}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            Phone Number *
          </label>
          <Input
            value={basics.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="e.g. +1 (555) 019-2834"
            icon={<Phone className="h-4 w-4 text-neutral-400" />}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            Location *
          </label>
          <Input
            value={basics.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="e.g. San Francisco, CA (Open to Remote)"
            icon={<MapPin className="h-4 w-4 text-neutral-400" />}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            LinkedIn Profile
          </label>
          <Input
            value={basics.linkedin}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/username"
            icon={<Link2 className="h-4 w-4 text-neutral-400" />}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            GitHub Profile
          </label>
          <Input
            value={basics.github}
            onChange={(e) => handleChange("github", e.target.value)}
            placeholder="https://github.com/username"
            icon={<Code2 className="h-4 w-4 text-neutral-400" />}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            Portfolio / Personal Website
          </label>
          <Input
            value={basics.portfolio}
            onChange={(e) => handleChange("portfolio", e.target.value)}
            placeholder="https://yourportfolio.dev"
            icon={<Globe className="h-4 w-4 text-neutral-400" />}
          />
        </div>
      </div>
    </div>
  );
}
