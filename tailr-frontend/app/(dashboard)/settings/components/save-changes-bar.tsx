"use client";

import * as React from "react";
import {
  UnsavedChangesBar,
  UnsavedChangesBarProps,
} from "@/shared/components/ui/unsaved-changes-bar";

export type SaveChangesBarProps = UnsavedChangesBarProps;

export function SaveChangesBar(props: SaveChangesBarProps) {
  return <UnsavedChangesBar {...props} />;
}
