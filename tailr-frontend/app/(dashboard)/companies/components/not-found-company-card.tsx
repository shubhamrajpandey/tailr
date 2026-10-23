"use client";

import * as React from "react";
import { Building2, Plus, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";

interface NotFoundCompanyCardProps {
  onOpenAddCompany: (initialName?: string) => void;
  className?: string;
}

export function NotFoundCompanyCard({
  onOpenAddCompany,
  className,
}: NotFoundCompanyCardProps) {
  const [companyName, setCompanyName] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenAddCompany(companyName.trim());
    setCompanyName("");
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-dashed border-indigo-500/30 dark:border-indigo-500/25 bg-gradient-to-r from-indigo-500/[0.04] via-purple-500/[0.03] to-transparent dark:from-indigo-950/25 dark:via-purple-950/15 p-4 sm:p-5 backdrop-blur-xs transition-all hover:border-indigo-500/50 ${
        className || ""
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left copy & icon */}
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <span>Not found your company?</span>
              </h3>
              <Badge
                variant="outline"
                className="text-[10px] py-0 px-2 h-4.5 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-semibold gap-1"
              >
                <Sparkles className="h-2.5 w-2.5" />
                <span>Community Directory</span>
              </Badge>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
              Missing an organization? Add it here with tech stack and HR details so everyone can
              tailor their resumes accurately.
            </p>
          </div>
        </div>

        {/* Right quick form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto shrink-0"
        >
          <div className="relative min-w-0 sm:w-64 lg:w-72">
            <Input
              type="text"
              placeholder="Enter company name..."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="h-9 text-xs pr-2"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="h-9 gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Company</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
