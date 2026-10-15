"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Laptop,
  Check,
  LayoutGrid,
  CheckCircle2,
  Save,
  Palette,
  Eye,
} from "lucide-react";
import { SettingsSection } from "./settings-section";
import { Switch } from "@/shared/components/ui/switch";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useSettings } from "@/shared/hooks/use-settings";
import { cn } from "@/shared/lib/utils";

export function AppearancePanel() {
  const { theme, setTheme } = useTheme();
  const { settings, updateAppearance } = useSettings();

  const [density, setDensity] = React.useState<"comfortable" | "compact">(
    settings.appearance.density
  );
  const [highContrast, setHighContrast] = React.useState<boolean>(settings.appearance.highContrast);
  const [successFeedback, setSuccessFeedback] = React.useState<string | null>(null);

  React.useEffect(() => {
    setDensity(settings.appearance.density);
    setHighContrast(settings.appearance.highContrast);
  }, [settings.appearance.density, settings.appearance.highContrast]);

  const isDirty = React.useMemo(() => {
    return (
      density !== settings.appearance.density || highContrast !== settings.appearance.highContrast
    );
  }, [density, highContrast, settings.appearance]);

  const handleSelectTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
    updateAppearance({ theme: selectedTheme as any });
    setSuccessFeedback(`Theme switched to ${selectedTheme}.`);
    setTimeout(() => setSuccessFeedback(null), 3000);
  };

  const handleSave = async () => {
    await updateAppearance({
      theme: (theme || settings.appearance.theme) as any,
      density,
      highContrast,
    });
    setSuccessFeedback("Appearance preferences updated and saved.");
    setTimeout(() => setSuccessFeedback(null), 3500);
  };

  const handleDiscard = () => {
    setDensity(settings.appearance.density);
    setHighContrast(settings.appearance.highContrast);
  };

  const themeOptions = [
    {
      id: "light",
      label: "Light Mode",
      description: "Clean daylight interface with neutral slate backgrounds and high contrast.",
      icon: Sun,
      preview: (
        <div className="h-20 w-full rounded-md bg-slate-50 border border-neutral-200 p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-neutral-300" />
            <div className="h-1.5 w-12 rounded bg-neutral-200" />
          </div>
          <div className="space-y-1">
            <div className="h-2 w-full rounded bg-indigo-100" />
            <div className="h-2 w-3/4 rounded bg-neutral-200" />
          </div>
        </div>
      ),
    },
    {
      id: "dark",
      label: "Dark Mode",
      description:
        "Deep neutral dark interface with glowing indigo accents and minimal eye strain.",
      icon: Moon,
      preview: (
        <div className="h-20 w-full rounded-md bg-[#090a0c] border border-white/10 p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-white/20" />
            <div className="h-1.5 w-12 rounded bg-white/10" />
          </div>
          <div className="space-y-1">
            <div className="h-2 w-full rounded bg-indigo-500/20" />
            <div className="h-2 w-3/4 rounded bg-white/10" />
          </div>
        </div>
      ),
    },
    {
      id: "system",
      label: "System Preference",
      description: "Automatically synchronizes with your device operating system theme schedule.",
      icon: Laptop,
      preview: (
        <div className="h-20 w-full rounded-md overflow-hidden border border-neutral-200 dark:border-white/10 flex">
          <div className="w-1/2 bg-slate-50 p-2 flex flex-col justify-between">
            <div className="h-1.5 w-6 rounded bg-neutral-300" />
            <div className="h-2 w-full rounded bg-indigo-100" />
          </div>
          <div className="w-1/2 bg-[#090a0c] p-2 flex flex-col justify-between">
            <div className="h-1.5 w-6 rounded bg-white/20" />
            <div className="h-2 w-full rounded bg-indigo-500/20" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {successFeedback && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successFeedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Appearance Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Theme Selection */}
          <SettingsSection
            title="Interface Theme"
            description="Select your preferred color scheme across all Tailr dashboard pages."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {themeOptions.map((opt) => {
                const isSelected = theme === opt.id;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectTheme(opt.id)}
                    className={cn(
                      "group relative flex flex-col justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs"
                        : "border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 bg-white dark:bg-neutral-900/30"
                    )}
                  >
                    <div className="space-y-3 w-full">
                      {opt.preview}

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                            <Icon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                            {opt.label}
                          </span>
                          {isSelected && (
                            <span className="h-4 w-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                              <Check className="h-2.5 w-2.5" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </SettingsSection>

          {/* Density Settings */}
          <SettingsSection
            title="Workspace Density"
            description="Choose between comfortable spacious margins or compact data-dense tables."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => setDensity("comfortable")}
                className={cn(
                  "flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer",
                  density === "comfortable"
                    ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-500/5 shadow-xs"
                    : "border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-neutral-300 dark:hover:border-white/20"
                )}
              >
                <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <LayoutGrid className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    Comfortable (Default)
                  </span>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    Spacious margins, standard typography hierarchy, and comfortable table rows.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDensity("compact")}
                className={cn(
                  "flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer",
                  density === "compact"
                    ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-500/5 shadow-xs"
                    : "border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-neutral-300 dark:hover:border-white/20"
                )}
              >
                <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <LayoutGrid className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    Compact View
                  </span>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    Tighter row padding and reduced margins to maximize visible data per screen.
                  </p>
                </div>
              </button>
            </div>
          </SettingsSection>

          {/* High Contrast */}
          <SettingsSection
            title="Accessibility & Contrast"
            description="Fine-tune border definition and card contrast for high-clarity viewing."
          >
            <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
              <div className="space-y-0.5 max-w-lg">
                <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                  High Contrast Card & Table Borders
                </span>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Increases border opacity to provide sharper definition in brightly lit
                  environments.
                </p>
              </div>
              <Switch checked={highContrast} onCheckedChange={setHighContrast} />
            </div>
          </SettingsSection>

          {/* In-Card Dirty State Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/40">
            <div className="flex items-center gap-2">
              {isDirty ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Unsaved Appearance Settings
                </span>
              ) : (
                <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Appearance settings up to date
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {isDirty && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDiscard}
                  className="text-xs font-semibold w-full sm:w-auto"
                >
                  Discard
                </Button>
              )}
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={!isDirty}
                className="gap-2 text-xs font-semibold w-full sm:w-auto shadow-2xs"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Appearance</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Theme & Contrast Guide */}
        <div className="space-y-5">
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-sm">
              <Palette className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
              <span>Design System Tokens</span>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Tailr dynamically calculates color scales with zero third-party framework overhead,
              supporting ultra-low latency rendering.
            </p>

            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-900 dark:text-white">
                <span className="font-semibold">Current Active Mode:</span>
                <Badge
                  variant="outline"
                  className="text-[10px] capitalize font-bold text-indigo-600 dark:text-indigo-400"
                >
                  {theme || "system"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 text-[11px]">
                <span>Spacing density:</span>
                <span className="capitalize font-medium text-neutral-900 dark:text-white">
                  {density}
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 text-[11px]">
                <span>High contrast borders:</span>
                <span className="font-medium text-neutral-900 dark:text-white">
                  {highContrast ? "Enabled" : "Off"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
