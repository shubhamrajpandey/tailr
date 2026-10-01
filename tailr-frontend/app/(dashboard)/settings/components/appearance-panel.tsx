"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, Check, LayoutGrid, CheckCircle2 } from "lucide-react";
import { SettingsSection } from "./settings-section";
import { Switch } from "@/shared/components/ui/switch";
import { SaveChangesBar } from "./save-changes-bar";
import { useSettings } from "@/shared/hooks/use-settings";
import { cn } from "@/shared/lib/utils";

export function AppearancePanel() {
  const { theme, setTheme } = useTheme();
  const { settings, updateAppearance } = useSettings();

  const [density, setDensity] = React.useState<"comfortable" | "compact">(
    settings.appearance.density
  );
  const [highContrast, setHighContrast] = React.useState<boolean>(
    settings.appearance.highContrast
  );
  const [successFeedback, setSuccessFeedback] = React.useState<string | null>(null);

  const isDirty = React.useMemo(() => {
    return (
      density !== settings.appearance.density ||
      highContrast !== settings.appearance.highContrast
    );
  }, [density, highContrast, settings.appearance]);

  const handleSelectTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
    updateAppearance({ theme: selectedTheme as any });
    setSuccessFeedback(`Theme set to ${selectedTheme}.`);
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

  const handleReset = () => {
    setDensity(settings.appearance.density);
    setHighContrast(settings.appearance.highContrast);
  };

  const themeOptions = [
    {
      id: "light",
      label: "Light Mode",
      description: "Clean, high-clarity daylight interface with neutral slate backgrounds.",
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
      description: "Sleek, deep neutral dark interface with glowing indigo accents.",
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
      description: "Automatically matches your operating system appearance schedule.",
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
    <div className="space-y-6">
      {successFeedback && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successFeedback}</span>
        </div>
      )}

      {/* Theme Selection */}
      <SettingsSection
        title="Interface Theme"
        description="Choose your preferred color theme or synchronize automatically with system settings."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themeOptions.map((opt) => {
            const isSelected = theme === opt.id;
            const Icon = opt.icon;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectTheme(opt.id)}
                className={cn(
                  "flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer group relative",
                  isSelected
                    ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-500/5 shadow-xs"
                    : "border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-neutral-300 dark:hover:border-white/20"
                )}
              >
                {opt.preview}

                <div className="mt-3 flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                      {opt.label}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="h-4 w-4 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                  {opt.description}
                </p>
              </button>
            );
          })}
        </div>
      </SettingsSection>

      {/* Density & Layout */}
      <SettingsSection
        title="Workspace Density"
        description="Adjust table row spacing and component padding across all CRM views."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setDensity("comfortable")}
            className={cn(
              "flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer",
              density === "comfortable"
                ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-500/5"
                : "border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-neutral-300 dark:hover:border-white/20"
            )}
          >
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <LayoutGrid className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                Comfortable (Default)
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Generous margins, standard font sizing, and spacious form inputs.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDensity("compact")}
            className={cn(
              "flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer",
              density === "compact"
                ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-500/5"
                : "border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-neutral-300 dark:hover:border-white/20"
            )}
          >
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <LayoutGrid className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                Compact View
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Tighter table rows and list spacing to display more data per screen.
              </p>
            </div>
          </button>
        </div>
      </SettingsSection>

      {/* Accessibility & Visual Comfort */}
      <SettingsSection
        title="Accessibility & High Contrast"
        description="Fine-tune contrast and border definition for enhanced legibility."
      >
        <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
          <div className="space-y-0.5 max-w-lg">
            <span className="text-xs font-semibold text-neutral-900 dark:text-white">
              High Contrast Borders
            </span>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Increases the opacity and definition of table grid lines and card borders.
            </p>
          </div>
          <Switch
            checked={highContrast}
            onCheckedChange={setHighContrast}
          />
        </div>
      </SettingsSection>

      <SaveChangesBar
        isDirty={isDirty}
        onReset={handleReset}
        onSave={handleSave}
        saveText="Save Appearance"
      />
    </div>
  );
}
