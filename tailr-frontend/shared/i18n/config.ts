"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import eng from "./locales/eng.json";
import nep from "./locales/nep.json";
import spa from "./locales/spa.json";
import ger from "./locales/ger.json";

export const SUPPORTED_LANGUAGES = [
  {
    code: "eng",
    name: "English",
    nativeName: "English",
    locale: "en-US",
    currency: "USD",
    currencySymbol: "$",
    dateFormat: "MM/DD/YYYY",
  },
  {
    code: "nep",
    name: "Nepali",
    nativeName: "नेपाली",
    locale: "ne-NP",
    currency: "NPR",
    currencySymbol: "रु",
    dateFormat: "YYYY/MM/DD",
    fontFamily: "var(--font-noto-nepali, 'Noto Sans Devanagari', sans-serif)",
  },
  {
    code: "spa",
    name: "Spanish",
    nativeName: "Español",
    locale: "es-ES",
    currency: "EUR",
    currencySymbol: "€",
    dateFormat: "DD/MM/YYYY",
  },
  {
    code: "ger",
    name: "German",
    nativeName: "Deutsch",
    locale: "de-DE",
    currency: "EUR",
    currencySymbol: "€",
    dateFormat: "DD.MM.YYYY",
  },
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export const LANGUAGE_STORAGE_KEY = "tailr_language";
export const DEFAULT_LANGUAGE: SupportedLanguageCode = "eng";

export const resources = {
  eng: { translation: eng },
  nep: { translation: nep },
  spa: { translation: spa },
  ger: { translation: ger },
} as const;

const getInitialLanguage = (): SupportedLanguageCode => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && ["eng", "nep", "spa", "ger"].includes(saved)) {
      return saved as SupportedLanguageCode;
    }
  }
  return DEFAULT_LANGUAGE;
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false, // React already protects against XSS
    },
    react: {
      useSuspense: false,
    },
  });
}

export const changeAppLanguage = async (langCode: SupportedLanguageCode) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);
    document.documentElement.lang = langCode === "nep" ? "ne" : langCode === "spa" ? "es" : langCode === "ger" ? "de" : "en";
    if (langCode === "nep") {
      document.body.classList.add("lang-nepali");
    } else {
      document.body.classList.remove("lang-nepali");
    }
  }
  await i18n.changeLanguage(langCode);
};

export default i18n;
