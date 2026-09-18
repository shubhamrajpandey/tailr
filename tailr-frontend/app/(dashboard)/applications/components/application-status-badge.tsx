import * as React from "react";
import { Badge, BadgeVariant } from "@/shared/components/ui/badge";
import { ApplicationStatus } from "@/shared/types/application";
import { cn } from "@/shared/lib/utils";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
  dot?: boolean;
}

const statusVariantMap: Record<ApplicationStatus, BadgeVariant> = {
  WISHLIST: "wishlist",
  APPLIED: "applied",
  INTERVIEW: "interview",
  OFFER: "offer",
  REJECTED: "rejected",
  GHOSTED: "ghosted",
};

const statusLabelMap: Record<ApplicationStatus, string> = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  GHOSTED: "Ghosted",
};

export function ApplicationStatusBadge({
  status,
  className,
  dot = true,
}: ApplicationStatusBadgeProps) {
  const variant = statusVariantMap[status] || "default";
  const label = statusLabelMap[status] || status;

  return (
    <Badge
      variant={variant}
      dot={dot}
      className={cn("capitalize tracking-normal", className)}
    >
      {label}
    </Badge>
  );
}
