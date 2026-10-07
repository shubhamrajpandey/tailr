"use client";

import * as React from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE, SupportedLanguageCode } from "./config";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguageCode;
    if (saved && ["eng", "nep", "spa", "ger"].includes(saved)) {
      i18n.changeLanguage(saved);
      document.documentElement.lang =
        saved === "nep" ? "ne" : saved === "spa" ? "es" : saved === "ger" ? "de" : "en";
      if (saved === "nep") {
        document.body.classList.add("lang-nepali");
      }
    } else {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE);
    }
    setIsReady(true);
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
