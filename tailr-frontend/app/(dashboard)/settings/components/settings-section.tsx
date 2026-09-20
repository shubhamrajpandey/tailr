import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

interface SettingsSectionProps {
  title: string;
  description: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function SettingsSection({
  title,
  description,
  badge,
  action,
  className,
  children,
}: SettingsSectionProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="border-b border-neutral-200 dark:border-white/5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <CardTitle className="text-base font-semibold text-neutral-900 dark:text-white">
                {title}
              </CardTitle>
              {badge}
            </div>
            <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400">
              {description}
            </CardDescription>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}
